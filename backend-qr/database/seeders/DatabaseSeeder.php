<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Profesor',
            'email' => 'docente@utgz.edu.mx',
            'password' => Hash::make('password123'),
            'role' => 'docente',
        ]);


        User::create([
            'name' => 'David',
            'email' => 'david@utgz.edu.mx',
            'password' => Hash::make('password123'),
            'role' => 'alumno',
        ]);

        User::create([
            'name' => 'Maria Lopez',
            'email' => 'maria@utgz.edu.mx',
            'password' => Hash::make('password123'),
            'role' => 'alumno',
        ]);
    }
}