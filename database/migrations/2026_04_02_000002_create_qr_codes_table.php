<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::dropIfExists('links');
        Schema::create('qr_codes', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\DB::raw('gen_random_uuid()'));
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name', 100);
            $table->string('slug', 50)->unique();
            $table->text('destination_url');
            $table->boolean('is_active')->default(true);
            $table->string('fg_color', 20)->default('#000000');
            $table->string('bg_color', 20)->default('#FFFFFF');
            $table->string('dot_style', 20)->default('square');
            $table->string('corner_style', 20)->default('square');
            $table->string('logo_url', 255)->nullable();
            $table->integer('logo_size')->default(30);
            $table->integer('qr_size')->default(300);
            $table->string('error_correction', 1)->default('M');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('qr_codes');
    }
};
