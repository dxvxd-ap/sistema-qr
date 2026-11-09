<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AsistenciaController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/asistencias', [AsistenciaController::class, 'store']);
    Route::post('/asistencias/qr', [AsistenciaController::class, 'store']);
    Route::get('/asistencias', [AsistenciaController::class, 'index']);
});
