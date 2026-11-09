<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Asistencia;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Profesor',
            'email' => 'docente@utgz.edu.mx',
            'password' => Hash::make('password123'),
            'role' => 'docente',
        ]);

        $david = User::create([
            'name' => 'David',
            'email' => 'david@utgz.edu.mx',
            'password' => Hash::make('password123'),
            'role' => 'alumno',
        ]);

        $maria = User::create([
            'name' => 'Maria Lopez',
            'email' => 'maria@utgz.edu.mx',
            'password' => Hash::make('password123'),
            'role' => 'alumno',
        ]);

        Asistencia::create([
            'user_id' => $david->id,
            'codigo_qr' => 'UTGZ|Sesión 1|10° A|' . (time() - 300) . '|UTGZ-DEMO-01',
            'sesion' => 'Sesión 1',
            'grupo' => '10° A',
            'fecha' => now()->toDateString(),
        ]);

        Asistencia::create([
            'user_id' => $maria->id,
            'codigo_qr' => 'UTGZ|Sesión 1|10° A|' . (time() - 250) . '|UTGZ-DEMO-02',
            'sesion' => 'Sesión 1',
            'grupo' => '10° A',
            'fecha' => now()->toDateString(),
        ]);
    }
}
