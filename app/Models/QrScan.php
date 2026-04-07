<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class QrScan extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'qr_id', 'scanned_at', 'ip', 'country', 'city',
        'device', 'os', 'browser', 'referer', 'user_agent',
    ];

    protected $casts = [
        'scanned_at' => 'datetime',
    ];

    public function qrCode()
    {
        return $this->belongsTo(QrCode::class, 'qr_id');
    }
}
