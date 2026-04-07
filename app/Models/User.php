<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'username', 'email', 'password', 'avatar_url', 'plan', 'is_admin', 'qr_limit',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_admin'          => 'boolean',
            'qr_limit'          => 'integer',
        ];
    }

    public function hasReachedQrLimit(): bool
    {
        if ($this->is_admin) return false;
        return $this->qrCodes()->count() >= $this->qr_limit;
    }

    public function qrCodes()
    {
        return $this->hasMany(QrCode::class);
    }
}
