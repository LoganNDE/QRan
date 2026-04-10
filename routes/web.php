<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QrController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/inactive', function () {
    return Inertia::render('Inactive');
});

// Legal pages
Route::get('/privacy', fn() => Inertia::render('Legal/Privacy'));
Route::get('/legal',   fn() => Inertia::render('Legal/LegalNotice'));
Route::get('/terms',   fn() => Inertia::render('Legal/Terms'));

// QR Redirect (public)
Route::get('/r/{slug}', [QrController::class, 'redirect'])->middleware('throttle:60,1');

// Auth required routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [QrController::class, 'index'])->name('dashboard');
    Route::get('/qr/create', [QrController::class, 'create'])->name('qr.create');
    Route::post('/qr', [QrController::class, 'store'])->name('qr.store');
    Route::get('/qr/{id}', [QrController::class, 'show'])->name('qr.show');
    Route::put('/qr/{id}', [QrController::class, 'update'])->name('qr.update');
    Route::delete('/qr/{id}', [QrController::class, 'destroy'])->name('qr.destroy');
    Route::patch('/qr/{id}/toggle', [QrController::class, 'toggle'])->name('qr.toggle');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
