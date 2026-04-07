<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('qr_scans', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\DB::raw('gen_random_uuid()'));
            $table->uuid('qr_id');
            $table->foreign('qr_id')->references('id')->on('qr_codes')->onDelete('cascade');
            $table->timestampTz('scanned_at')->useCurrent();
            $table->string('ip', 45)->nullable();
            $table->string('country', 60)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('device', 50)->nullable();
            $table->string('os', 50)->nullable();
            $table->string('browser', 50)->nullable();
            $table->string('referer', 255)->nullable();
            $table->text('user_agent')->nullable();
        });
    }
    public function down(): void {
        Schema::dropIfExists('qr_scans');
    }
};
