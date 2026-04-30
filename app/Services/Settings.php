<?php

namespace App\Services;

class Settings
{
    private static function path(): string
    {
        return storage_path('app/settings.json');
    }

    private static function load(): array
    {
        $path = self::path();
        if (!file_exists($path)) return [];
        return json_decode(file_get_contents($path), true) ?? [];
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return self::load()[$key] ?? $default;
    }

    public static function set(string $key, mixed $value): void
    {
        $data = self::load();
        $data[$key] = $value;
        file_put_contents(self::path(), json_encode($data, JSON_PRETTY_PRINT));
    }

    public static function all(): array
    {
        return self::load();
    }
}
