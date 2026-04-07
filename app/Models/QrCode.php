<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class QrCode extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id', 'name', 'slug', 'destination_url', 'is_active',
        'fg_color', 'bg_color', 'dot_style', 'corner_style',
        'logo_url', 'logo_size', 'qr_size', 'error_correction',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scans()
    {
        return $this->hasMany(QrScan::class, 'qr_id');
    }
}
