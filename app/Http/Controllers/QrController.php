<?php
namespace App\Http\Controllers;

use App\Models\QrCode;
use App\Models\QrScan;
use Illuminate\Http\Request;
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

        $data = $request->validate([
            'name'            => 'required|string|max:100',
            'destination_url' => 'required|url|max:2048',
            'fg_color'        => 'sometimes|string|max:20',
            'bg_color'        => 'sometimes|string|max:20',
            'dot_style'       => 'sometimes|string|max:20',
            'corner_style'    => 'sometimes|string|max:20',
            'qr_size'         => 'sometimes|integer|min:100|max:1000',
            'error_correction'=> 'sometimes|string|in:L,M,Q,H',
        ]);

        $data['user_id'] = $user->id;
        $data['slug'] = Str::random(8);
        while (QrCode::where('slug', $data['slug'])->exists()) {
            $data['slug'] = Str::random(8);
        }

        $qr = QrCode::create($data);

        return redirect()->route('qr.show', $qr->id)->with('success', 'QR creado exitosamente');
    }

    public function show(string $id)
    {
        $qr = QrCode::where('id', $id)
            ->where('user_id', auth()->id())
            ->withCount('scans')
            ->withMax('scans', 'scanned_at')
            ->firstOrFail();

        $qr->scans_count = $qr->scans_count;
        $qr->last_scan = $qr->scans_max_scanned_at;
        unset($qr->scans_max_scanned_at);

        // Run stats queries in parallel using lazy evaluation
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

        return Inertia::render('QrDetail', [
            'qr' => $qr,
            'stats' => [
                'timeline' => $timeline,
                'devices' => $devices,
                'countries' => $countries,
            ],
        ]);
    }

    public function update(Request $request, string $id)
    {
        $qr = QrCode::where('id', $id)->where('user_id', auth()->id())->firstOrFail();

        $data = $request->validate([
            'name'            => 'sometimes|string|max:100',
            'destination_url' => 'sometimes|url|max:2048',
            'fg_color'        => 'sometimes|string|max:20',
            'bg_color'        => 'sometimes|string|max:20',
            'dot_style'       => 'sometimes|string|max:20',
            'corner_style'    => 'sometimes|string|max:20',
            'qr_size'         => 'sometimes|integer|min:100|max:1000',
            'error_correction'=> 'sometimes|string|in:L,M,Q,H',
            'is_active'       => 'sometimes|boolean',
        ]);

        $qr->update($data);

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

        // Record scan
        $ua = request()->userAgent() ?? '';
        QrScan::create([
            'qr_id'      => $qr->id,
            'scanned_at' => now(),
            'ip'         => request()->ip(),
            'user_agent' => $ua,
            'referer'    => request()->header('referer'),
            'device'     => $this->detectDevice($ua),
            'os'         => $this->detectOS($ua),
            'browser'    => $this->detectBrowser($ua),
        ]);

        if (!$qr->is_active) {
            return redirect(config('app.url') . '/inactive');
        }

        return redirect($qr->destination_url, 302);
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
