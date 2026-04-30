<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Settings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function show()
    {
        return Inertia::render('Admin/Settings', [
            'registrations_enabled' => Settings::get('registrations_enabled', true),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'registrations_enabled' => 'required|boolean',
        ]);

        Settings::set('registrations_enabled', (bool) $request->boolean('registrations_enabled'));

        return back()->with('success', 'Configuración guardada');
    }
}
