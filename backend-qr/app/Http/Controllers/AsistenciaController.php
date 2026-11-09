<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Asistencia;

class AsistenciaController extends Controller
{
    public function store(Request $request)
    {
        $codigo = $request->input('code') ?? $request->input('codigo_qr');

        if (!$codigo) {
            return response()->json([
                'success' => false,
                'message' => 'Sesión no encontrada'
            ], 404);
        }

        $user = $request->user();

        if ($user->role !== 'alumno') {
            return response()->json([
                'success' => false,
                'message' => 'Alumno fuera del grupo'
            ], 403);
        }

        $sesion = 'Sesión 1';
        $grupo = '10° A';
        $timestamp = null;

        if (str_starts_with($codigo, '{')) {
            $parsed = json_decode($codigo, true);
            if (!$parsed || empty($parsed['codigo'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sesión no encontrada'
                ], 404);
            }
            $sesion = $parsed['sesion'] ?? 'Sesión 1';
            $grupo = $parsed['grupo'] ?? '10° A';
            $timestamp = $parsed['timestamp'] ?? null;
        } elseif (str_starts_with($codigo, 'UTGZ')) {
            $partes = explode('|', $codigo);
            if (count($partes) >= 4) {
                $sesion = $partes[1];
                $grupo = $partes[2];
                $timestamp = (int)$partes[3];
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Sesión no encontrada'
            ], 404);
        }

        if ($timestamp && (time() - $timestamp > 600)) {
            return response()->json([
                'success' => false,
                'message' => 'QR vencido'
            ], 410);
        }

        $userId = $user->id;
        $hoy = now()->toDateString();

        $yaAsistio = Asistencia::where('user_id', $userId)
                               ->where('fecha', $hoy)
                               ->where('sesion', $sesion)
                               ->exists();

        if ($yaAsistio) {
            return response()->json([
                'success' => false,
                'message' => 'Asistencia ya registrada'
            ], 429);
        }

        $asistencia = Asistencia::create([
            'user_id'   => $userId,
            'codigo_qr' => $codigo,
            'sesion'    => $sesion,
            'grupo'     => $grupo,
            'fecha'     => $hoy,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Asistencia registrada',
            'data'    => $asistencia
        ], 201);
    }

    public function index(Request $request)
    {
        $query = Asistencia::with('user:id,name,email')->latest();

        if ($request->filled('sesion')) {
            $query->where('sesion', 'like', '%' . $request->sesion . '%');
        }
        if ($request->filled('grupo')) {
            $query->where('grupo', 'like', '%' . $request->grupo . '%');
        }
        if ($request->filled('alumno')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->alumno . '%')
                  ->orWhere('email', 'like', '%' . $request->alumno . '%');
            });
        }

        return response()->json($query->get(), 200);
    }
}
