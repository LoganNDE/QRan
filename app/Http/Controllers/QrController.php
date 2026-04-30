<?php
namespace App\Http\Controllers;

use App\Models\QrCode;
use App\Models\QrScan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class QrController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $qrs = $user->qrCodes()
            ->withCount('scans')
            ->withMax('scans', 'scanned_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($qr) {
                $qr->last_scan = $qr->scans_max_scanned_at;
                unset($qr->scans_max_scanned_at);
                return $qr;
            });

        return Inertia::render('Dashboard', ['qrs' => $qrs]);
    }

    public function create()
    {
        $user = auth()->user();

        if ($user->hasReachedQrLimit()) {
            return redirect()->route('dashboard')
                ->with('error', "Has alcanzado el límite de {$user->qr_limit} QR codes.");
        }

        return Inertia::render('QrCreate');
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if ($user->hasReachedQrLimit()) {
            return back()->withErrors(['limit' => "Has alcanzado el límite de {$user->qr_limit} QR codes."]);
        }

        $base = $request->validate([
            'name'             => 'required|string|max:100',
            'qr_type'          => 'required|in:url,vcard,wifi,pdf',
            'fg_color'         => ['sometimes', 'string', 'regex:/^#[0-9A-Fa-f]{3,8}$/'],
            'bg_color'         => ['sometimes', 'string', 'regex:/^#[0-9A-Fa-f]{3,8}$/'],
            'dot_style'        => 'sometimes|string|in:square,rounded,dots,classy,classy-rounded,extra-rounded',
            'corner_style'     => 'sometimes|string|in:square,dot,extra-rounded',
            'qr_size'          => 'sometimes|integer|min:100|max:1000',
            'error_correction' => 'sometimes|string|in:L,M,Q,H',
        ]);

        $type = $request->qr_type;
        $meta = null;

        if ($type === 'url') {
            $validated = $request->validate([
                'destination_url' => ['required', 'url', 'max:2048', 'regex:/^https?:\/\//i'],
            ]);
            $base['destination_url'] = $validated['destination_url'];

        } elseif ($type === 'vcard') {
            $request->validate([
                'vc_first_name' => 'required|string|max:100',
                'vc_last_name'  => 'sometimes|nullable|string|max:100',
                'vc_phone'      => 'sometimes|nullable|string|max:30',
                'vc_email'      => 'sometimes|nullable|email|max:150',
                'vc_company'    => 'sometimes|nullable|string|max:100',
                'vc_website'    => 'sometimes|nullable|url|max:255',
                'vc_address'    => 'sometimes|nullable|string|max:255',
            ]);
            $meta = $request->only(['vc_first_name','vc_last_name','vc_phone','vc_email','vc_company','vc_website','vc_address']);
            $base['destination_url'] = $this->buildVCard($meta);

        } elseif ($type === 'wifi') {
            // Normalize wifi_hidden: FormData sends booleans as strings ("false"/"true")
            if ($request->has('wifi_hidden')) {
                $request->merge(['wifi_hidden' => filter_var($request->input('wifi_hidden'), FILTER_VALIDATE_BOOLEAN)]);
            }
            $request->validate([
                'wifi_ssid'     => 'required|string|max:100',
                'wifi_password' => 'sometimes|nullable|string|max:100',
                'wifi_security' => 'sometimes|string|in:WPA,WEP,nopass',
                'wifi_hidden'   => 'sometimes|boolean',
            ]);
            $meta = $request->only(['wifi_ssid','wifi_password','wifi_security','wifi_hidden']);
            $base['destination_url'] = $this->buildWifi($meta);

        } elseif ($type === 'pdf') {
            $request->validate([
                'pdf_file' => 'required|file|mimes:pdf|max:5120',
            ]);
            $path = $request->file('pdf_file')->store('pdfs', 'uploads');
            $base['destination_url'] = Storage::disk('uploads')->url($path);
            $meta = ['pdf_name' => $request->file('pdf_file')->getClientOriginalName()];
        }

        $base['user_id'] = $user->id;
        $base['meta']    = $meta;
        $base['slug']    = Str::random(8);
        while (QrCode::where('slug', $base['slug'])->exists()) {
            $base['slug'] = Str::random(8);
        }

        $qr = QrCode::create($base);

        if ($request->hasFile('logo')) {
            $request->validate(['logo' => 'image|mimes:jpeg,png,jpg,gif,webp|max:1024']);
            $path = $request->file('logo')->store('logos', 'uploads');
            $qr->update([
                'logo_url'  => Storage::disk('uploads')->url($path),
                'logo_size' => (int) $request->input('logo_size', 30),
            ]);
        }

        return redirect()->route('qr.show', $qr->id)->with('success', 'QR creado exitosamente');
    }

    public function show(string $id)
    {
        $qr = QrCode::where('id', $id)
            ->where('user_id', auth()->id())
            ->withCount('scans')
            ->withMax('scans', 'scanned_at')
            ->firstOrFail();

        $qr->last_scan = $qr->scans_max_scanned_at;
        unset($qr->scans_max_scanned_at);

        $scansQuery = $qr->scans();

        $timeline = (clone $scansQuery)
            ->selectRaw("DATE(scanned_at) as date, COUNT(*) as count")
            ->where('scanned_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $devices = (clone $scansQuery)
            ->selectRaw("device, COUNT(*) as count")
            ->groupBy('device')
            ->get();

        $countries = (clone $scansQuery)
            ->selectRaw("country, COUNT(*) as count")
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        $browsers = (clone $scansQuery)
            ->selectRaw("browser, COUNT(*) as count")
            ->whereNotNull('browser')
            ->groupBy('browser')
            ->orderByDesc('count')
            ->get();

        $osBreakdown = (clone $scansQuery)
            ->selectRaw("os, COUNT(*) as count")
            ->whereNotNull('os')
            ->groupBy('os')
            ->orderByDesc('count')
            ->get();

        $cities = (clone $scansQuery)
            ->selectRaw("city, COUNT(*) as count")
            ->whereNotNull('city')
            ->groupBy('city')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        $todayCount = (clone $scansQuery)
            ->whereDate('scanned_at', today())
            ->count();

        $weekCount = (clone $scansQuery)
            ->where('scanned_at', '>=', now()->startOfWeek())
            ->count();

        return Inertia::render('QrDetail', [
            'qr'    => $qr,
            'stats' => [
                'timeline'  => $timeline,
                'devices'   => $devices,
                'countries' => $countries,
                'browsers'  => $browsers,
                'os'        => $osBreakdown,
                'cities'    => $cities,
                'today'     => $todayCount,
                'week'      => $weekCount,
            ],
        ]);
    }

    public function update(Request $request, string $id)
    {
        $qr = QrCode::where('id', $id)->where('user_id', auth()->id())->firstOrFail();

        $base = $request->validate([
            'name'             => 'sometimes|string|max:100',
            'fg_color'         => ['sometimes', 'string', 'regex:/^#[0-9A-Fa-f]{3,8}$/'],
            'bg_color'         => ['sometimes', 'string', 'regex:/^#[0-9A-Fa-f]{3,8}$/'],
            'dot_style'        => 'sometimes|string|in:square,rounded,dots,classy,classy-rounded,extra-rounded',
            'corner_style'     => 'sometimes|string|in:square,dot,extra-rounded',
            'qr_size'          => 'sometimes|integer|min:100|max:1000',
            'error_correction' => 'sometimes|string|in:L,M,Q,H',
            'is_active'        => 'sometimes|boolean',
        ]);

        $type = $qr->qr_type;

        if ($type === 'url') {
            if ($request->has('destination_url')) {
                $validated = $request->validate([
                    'destination_url' => ['required', 'url', 'max:2048', 'regex:/^https?:\/\//i'],
                ]);
                $base['destination_url'] = $validated['destination_url'];
            }

        } elseif ($type === 'vcard') {
            $request->validate([
                'vc_first_name' => 'required|string|max:100',
                'vc_last_name'  => 'sometimes|nullable|string|max:100',
                'vc_phone'      => 'sometimes|nullable|string|max:30',
                'vc_email'      => 'sometimes|nullable|email|max:150',
                'vc_company'    => 'sometimes|nullable|string|max:100',
                'vc_website'    => 'sometimes|nullable|url|max:255',
                'vc_address'    => 'sometimes|nullable|string|max:255',
            ]);
            $meta = $request->only(['vc_first_name','vc_last_name','vc_phone','vc_email','vc_company','vc_website','vc_address']);
            $base['destination_url'] = $this->buildVCard($meta);
            $base['meta'] = $meta;

        } elseif ($type === 'wifi') {
            if ($request->has('wifi_hidden')) {
                $request->merge(['wifi_hidden' => filter_var($request->input('wifi_hidden'), FILTER_VALIDATE_BOOLEAN)]);
            }
            $request->validate([
                'wifi_ssid'     => 'required|string|max:100',
                'wifi_password' => 'sometimes|nullable|string|max:100',
                'wifi_security' => 'sometimes|string|in:WPA,WEP,nopass',
                'wifi_hidden'   => 'sometimes|boolean',
            ]);
            $meta = $request->only(['wifi_ssid','wifi_password','wifi_security','wifi_hidden']);
            $base['destination_url'] = $this->buildWifi($meta);
            $base['meta'] = $meta;
        }

        $qr->update($base);

        return back()->with('success', 'QR actualizado');
    }

    public function destroy(string $id)
    {
        $qr = QrCode::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $qr->delete();

        return redirect()->route('dashboard')->with('success', 'QR eliminado');
    }

    public function toggle(string $id)
    {
        $qr = QrCode::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $qr->update(['is_active' => !$qr->is_active]);

        return back()->with('success', $qr->is_active ? 'QR activado' : 'QR desactivado');
    }

    public function redirect(string $slug)
    {
        $qr = QrCode::where('slug', $slug)->firstOrFail();

        $ua  = request()->userAgent() ?? '';
        $ip  = request()->ip();
        $geo = $this->geoLocate($ip);

        QrScan::create([
            'qr_id'      => $qr->id,
            'scanned_at' => now(),
            'ip'         => $ip,
            'user_agent' => $ua,
            'referer'    => request()->header('referer'),
            'device'     => $this->detectDevice($ua),
            'os'         => $this->detectOS($ua),
            'browser'    => $this->detectBrowser($ua),
            'country'    => $geo['country'] ?? null,
            'city'       => $geo['city']    ?? null,
        ]);

        if (!$qr->is_active) {
            return redirect(config('app.url') . '/inactive');
        }

        if ($qr->qr_type === 'vcard') {
            $filename = Str::slug($qr->name ?: 'contacto') . '.vcf';
            return response($qr->destination_url, 200, [
                'Content-Type'        => 'text/vcard; charset=utf-8',
                'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            ]);
        }

        if ($qr->qr_type === 'pdf') {
            $rel = ltrim(preg_replace('#^.*/uploads/#', '', $qr->destination_url), '/');
            if (!Storage::disk('uploads')->exists($rel)) {
                abort(404);
            }
            $originalName = $qr->meta['pdf_name'] ?? basename($rel);
            return Storage::disk('uploads')->response($rel, $originalName, [
                'Content-Type'        => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $originalName . '"',
            ]);
        }

        return redirect($qr->destination_url, 302);
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    public function uploadLogo(Request $request, string $id)
    {
        $qr = QrCode::where('id', $id)->where('user_id', auth()->id())->firstOrFail();

        $request->validate([
            'logo'      => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:1024',
            'logo_size' => 'sometimes|integer|min:10|max:50',
        ]);

        $updates = ['logo_size' => (int) $request->input('logo_size', $qr->logo_size ?? 30)];

        if ($request->hasFile('logo')) {
            if ($qr->logo_url) {
                Storage::disk('uploads')->delete(ltrim(preg_replace('#^.*/uploads/#', '', $qr->logo_url), '/'));
            }
            $path = $request->file('logo')->store('logos', 'uploads');
            $updates['logo_url'] = Storage::disk('uploads')->url($path);
        }

        $qr->update($updates);

        return back()->with('success', 'Logo actualizado');
    }

    public function removeLogo(string $id)
    {
        $qr = QrCode::where('id', $id)->where('user_id', auth()->id())->firstOrFail();

        if ($qr->logo_url) {
            Storage::disk('uploads')->delete(ltrim(preg_replace('#^.*/uploads/#', '', $qr->logo_url), '/'));
        }

        $qr->update(['logo_url' => null, 'logo_size' => 30]);

        return back()->with('success', 'Logo eliminado');
    }

    public function uploadPdf(Request $request, string $id)
    {
        $qr = QrCode::where('id', $id)->where('user_id', auth()->id())->where('qr_type', 'pdf')->firstOrFail();

        $request->validate(['pdf_file' => 'required|file|mimes:pdf|max:5120']);

        // Delete old PDF
        if ($qr->destination_url && str_contains($qr->destination_url, '/uploads/pdfs/')) {
            Storage::disk('uploads')->delete(ltrim(preg_replace('#^.*/uploads/#', '', $qr->destination_url), '/'));
        }

        $path = $request->file('pdf_file')->store('pdfs', 'uploads');
        $qr->update([
            'destination_url' => Storage::disk('uploads')->url($path),
            'meta' => array_merge($qr->meta ?? [], ['pdf_name' => $request->file('pdf_file')->getClientOriginalName()]),
        ]);

        return back()->with('success', 'PDF actualizado');
    }

    private function geoLocate(string $ip): array
    {
        // Skip private / loopback addresses
        if (in_array($ip, ['127.0.0.1', '::1']) || str_starts_with($ip, '192.168.') || str_starts_with($ip, '10.')) {
            return [];
        }

        try {
            $res = Http::timeout(3)->get("http://ip-api.com/json/{$ip}", [
                'fields' => 'status,country,city',
                'lang'   => 'es',
            ]);

            if ($res->ok() && ($res->json('status') === 'success')) {
                return [
                    'country' => $res->json('country'),
                    'city'    => $res->json('city'),
                ];
            }
        } catch (\Throwable) {
            // Geo lookup failed — don't block the redirect
        }

        return [];
    }

    private function buildVCard(array $meta): string
    {
        $first = $meta['vc_first_name'] ?? '';
        $last  = $meta['vc_last_name']  ?? '';
        $full  = trim("$first $last");

        $v  = "BEGIN:VCARD\r\nVERSION:3.0\r\n";
        $v .= "FN:{$full}\r\n";
        $v .= "N:{$last};{$first};;;\r\n";
        if (!empty($meta['vc_phone']))   $v .= "TEL;TYPE=CELL:{$meta['vc_phone']}\r\n";
        if (!empty($meta['vc_email']))   $v .= "EMAIL:{$meta['vc_email']}\r\n";
        if (!empty($meta['vc_company'])) $v .= "ORG:{$meta['vc_company']}\r\n";
        if (!empty($meta['vc_website'])) $v .= "URL:{$meta['vc_website']}\r\n";
        if (!empty($meta['vc_address'])) $v .= "ADR:;;{$meta['vc_address']};;;;\r\n";
        $v .= "END:VCARD";

        return $v;
    }

    private function buildWifi(array $meta): string
    {
        $ssid     = $meta['wifi_ssid']     ?? '';
        $pass     = $meta['wifi_password'] ?? '';
        $security = $meta['wifi_security'] ?? 'WPA';
        $hidden   = !empty($meta['wifi_hidden']) ? 'true' : 'false';

        $escape = fn(string $s) => preg_replace('/([\\\\;,":])/', '\\\\$1', $s);

        return "WIFI:T:{$security};S:{$escape($ssid)};P:{$escape($pass)};H:{$hidden};;";
    }

    private function detectDevice(string $ua): string
    {
        if (preg_match('/tablet|ipad/i', $ua)) return 'tablet';
        if (preg_match('/mobile|android|iphone/i', $ua)) return 'mobile';
        return 'desktop';
    }

    private function detectOS(string $ua): string
    {
        if (preg_match('/windows/i', $ua)) return 'Windows';
        if (preg_match('/mac os/i', $ua)) return 'macOS';
        if (preg_match('/android/i', $ua)) return 'Android';
        if (preg_match('/ios|iphone|ipad/i', $ua)) return 'iOS';
        if (preg_match('/linux/i', $ua)) return 'Linux';
        return 'Unknown';
    }

    private function detectBrowser(string $ua): string
    {
        if (preg_match('/edg/i', $ua)) return 'Edge';
        if (preg_match('/chrome/i', $ua)) return 'Chrome';
        if (preg_match('/firefox/i', $ua)) return 'Firefox';
        if (preg_match('/safari/i', $ua)) return 'Safari';
        if (preg_match('/opera/i', $ua)) return 'Opera';
        return 'Unknown';
    }
}
