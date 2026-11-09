# Registro de Asistencia mediante Código QR

**Universidad Tecnológica de Gutiérrez Zamora**  
**División de Tecnologías de la Información**  
**Cuatrimestre 10 — Unidad 2: Operación con QR**

## 1. Descripción del proyecto

Sistema de control de asistencia escolar mediante códigos QR con vigencia de diez minutos. El docente genera el código de una sesión y el alumno lo escanea desde la aplicación. El servidor valida la solicitud antes de guardar la asistencia.

El proyecto se divide en:

- **backend-qr:** API REST desarrollada con Laravel, autenticación mediante Laravel Sanctum y almacenamiento en MySQL.
- **app-qr:** aplicación desarrollada con Ionic, Angular con NgModules y Capacitor para Android y Web.

## 2. Requisitos

- PHP 8.2 o superior, con las extensiones requeridas por Laravel y `pdo_mysql` habilitada.
- Composer.
- Node.js y npm compatibles con la versión de Angular del proyecto.
- MySQL o MariaDB. Puede utilizarse el servicio MySQL de XAMPP.
- Ionic CLI.
- Android Studio y las herramientas de Android SDK para ejecutar la aplicación en Android.
- Dispositivo Android con cámara y depuración USB habilitada para probar el escaneo nativo.

Para instalar Ionic CLI:

```bash
npm install -g @ionic/cli
```

**Nota:** al utilizar `php artisan serve`, no es necesario iniciar Apache de XAMPP. El servicio MySQL sí debe estar en ejecución.

## 3. Estructura de la entrega

```text
Sistema-QR/
├── LEEME.md
├── backend-qr/
└── app-qr/
```

Comenzar por este archivo después de descomprimir el proyecto.

## 4. Instalación del servidor Laravel

### 4.1 Instalar dependencias

Abrir una terminal dentro de la carpeta principal del proyecto:

```bash
cd backend-qr
composer install
```

### 4.2 Configurar el entorno

Si no existe el archivo `.env`, crear una copia de `.env.example`.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

También puede copiarse manualmente y renombrarse como `.env`.

Configurar la conexión a la base de datos:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=app_qr
DB_USERNAME=root
DB_PASSWORD=
```

Estos valores corresponden a una configuración local habitual de XAMPP. Ajustar el puerto, usuario y contraseña si la instalación utiliza otros datos.

### 4.3 Crear la base de datos

Iniciar MySQL y crear una base de datos vacía llamada `app_qr`, desde phpMyAdmin o mediante SQL:

```sql
CREATE DATABASE IF NOT EXISTS app_qr
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### 4.4 Preparar la aplicación

Ejecutar:

```bash
php artisan key:generate
php artisan config:clear
php artisan migrate --seed
```

Las migraciones crean las tablas y los seeders cargan las cuentas y los datos de demostración.

**Reinicio de pruebas:** si se necesita reconstruir la base de datos, puede utilizarse el siguiente comando. Elimina las tablas y sus datos antes de ejecutar nuevamente las migraciones y los seeders.

```bash
php artisan migrate:fresh --seed
```

### 4.5 Iniciar la API

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

Mantener esta terminal abierta durante las pruebas.

En la computadora que ejecuta Laravel, la dirección base es:

```text
http://127.0.0.1:8000/api
```

## 5. Instalación del cliente Ionic

Abrir otra terminal desde la carpeta principal:

```bash
cd app-qr
npm install
```

Si la instalación presenta conflictos de dependencias entre paquetes, utilizar:

```bash
npm install --legacy-peer-deps
```

Esta opción permite continuar la instalación omitiendo la resolución estricta de dependencias pares. No sustituye la comprobación de compilación y funcionamiento.

### 5.1 Configurar la dirección de la API

Antes de ejecutar la aplicación, revisar la URL configurada en el archivo `app-qr/src/environments/environment.ts` en la propiedad `apiUrl`. También puede localizarse buscando `localhost:8000`, `127.0.0.1:8000` o la dirección anterior del servidor dentro del código de `app-qr`.

- **Pruebas web en la misma computadora:** utilizar `http://127.0.0.1:8000`.
- **Pruebas en un dispositivo Android físico:** utilizar la dirección IPv4 local de la computadora que ejecuta Laravel.

Para consultar la IP en Windows:

```powershell
ipconfig
```

Por ejemplo, si la dirección IPv4 es `192.168.1.100`, la API estará disponible en:

```text
http://192.168.1.100:8000/api
```

Conservar la estructura utilizada por los servicios: si estos ya agregan `/api` a las rutas, no repetirlo en la dirección base.

El teléfono y la computadora deben estar conectados a la misma red. Si la conexión es bloqueada, revisar que el firewall permita el acceso al puerto 8000 en la red privada.

### 5.2 Comprobar la compilación

Desde `app-qr`, ejecutar:

```bash
ionic build
```

El proyecto también dispone del comando:

```bash
npm run build
```

Comprobar que la compilación termine correctamente antes de sincronizar Android.

### 5.3 Ejecutar en Web

```bash
ionic serve
```

Este modo permite revisar la interfaz y la comunicación con la API. La lectura mediante el complemento de cámara nativa debe probarse en Android.

### 5.4 Ejecutar en Android

Después de configurar la URL de la API y compilar:

```bash
npx cap sync android
npx cap open android
```

En Android Studio:

1. Esperar a que termine la sincronización del proyecto.
2. Conectar el dispositivo con la depuración USB habilitada.
3. Seleccionar el dispositivo y pulsar **Run**.
4. Autorizar el permiso de cámara cuando la aplicación lo solicite.

Después de modificar el cliente, ejecutar nuevamente:

```bash
ionic build
npx cap sync android
```

## 6. Cuentas de demostración

Las siguientes cuentas se cargan mediante los seeders:

| Rol | Correo | Contraseña | Uso |
|---|---|---|---|
| Docente | docente@utgz.edu.mx | password123 | Generar códigos QR y consultar el panel de asistencias. |
| Alumno 1 | david@utgz.edu.mx | password123 | Registrar asistencia y consultar su historial. |
| Alumno 2 | maria@utgz.edu.mx | password123 | Probar el registro con un segundo usuario. |

Estas credenciales son para el entorno de demostración.

## 7. Flujo de operación

1. Iniciar MySQL, el servidor Laravel y la aplicación Ionic.
2. Iniciar sesión como docente y generar el código QR de la clase.
3. En otro dispositivo o sesión, iniciar sesión como alumno.
4. Escanear el código QR desde la aplicación Android.
5. Comprobar el mensaje de asistencia registrada.
6. Repetir el escaneo con el mismo alumno para comprobar el rechazo de duplicados.
7. Actualizar el panel docente para consultar el registro.
8. Probar un código vencido y uno inexistente para verificar los mensajes de error.

## 8. Reglas de validación

Las decisiones de registro se procesan en el servidor:

| Validación | Comportamiento |
|---|---|
| Autenticación | Las solicitudes sin un token válido se rechazan con HTTP 401. |
| Rol y grupo | El usuario debe tener rol de alumno y pertenecer al grupo correspondiente. Si no cumple las condiciones, se rechaza con HTTP 403. |
| Código y sesión | El código debe corresponder a una sesión válida. Los códigos inválidos o inexistentes se rechazan con HTTP 404. |
| Vigencia | El código tiene una vigencia de diez minutos. Cuando vence, se rechaza con HTTP 410. |
| Duplicidad | Solo se admite una asistencia por alumno, sesión y fecha. Los intentos repetidos se rechazan con HTTP 429. |
| Registro correcto | La asistencia se almacena y el servidor responde con HTTP 201. |

La vigencia limita el periodo de uso del QR; por sí sola no acredita la presencia física del alumno en el aula.

## 9. Endpoints de la API

Las rutas siguientes se agregan a la dirección del servidor.

### 9.1 Inicio de sesión

**POST `/api/login`**

Encabezados:

```http
Accept: application/json
Content-Type: application/json
```

Ejemplo de cuerpo:

```json
{
  "email": "david@utgz.edu.mx",
  "password": "password123"
}
```

Respuestas:

- **200 OK:** autenticación correcta; devuelve el token y los datos del usuario.
- **422 Unprocessable Entity:** credenciales o datos de inicio de sesión no válidos, según el comportamiento documentado del proyecto.

El token recibido se utiliza en las solicitudes protegidas.

### 9.2 Registro de asistencia

**POST `/api/asistencias/qr`**

Encabezados:

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <token>
```

Ejemplo de cuerpo:

```json
{
  "code": "<contenido_del_qr>"
}
```

También se documenta el campo alternativo `codigo_qr`. Enviar uno de los dos campos con el contenido capturado.

| Código | Resultado |
|---|---|
| 201 Created | Asistencia registrada. |
| 401 Unauthorized | Token ausente o inválido. |
| 403 Forbidden | Rol o grupo no autorizado. |
| 404 Not Found | Código inválido o sesión inexistente. |
| 410 Gone | Código QR vencido. |
| 429 Too Many Requests | Asistencia ya registrada. |

### 9.3 Consulta de asistencias

**GET `/api/asistencias`**

Encabezados:

```http
Accept: application/json
Authorization: Bearer <token>
```

**Respuesta correcta:** HTTP 200 con la lista de asistencias y la información relacionada del usuario.

Filtros opcionales:

| Parámetro | Descripción |
|---|---|
| `sesion` | Filtrar por sesión. |
| `grupo` | Filtrar por grupo. |
| `alumno` | Buscar por nombre o correo del alumno. |

Ejemplo:

```text
/api/asistencias?sesion=1&grupo=AEI&alumno=david
```

## 10. Verificación de la práctica

| Caso | Resultado esperado |
|---|---|
| Iniciar sesión con una cuenta demo válida | HTTP 200 y token de acceso. |
| Consultar asistencias con autorización | HTTP 200 y lista de registros. |
| Registrar una asistencia válida | HTTP 201 y confirmación de guardado. |
| Enviar una solicitud protegida sin token | HTTP 401. |
| Intentar registrar asistencia con un rol no permitido | HTTP 403. |
| Enviar un código inexistente | HTTP 404. |
| Enviar un código vencido sin modificar su contenido | HTTP 410. |
| Repetir una asistencia del mismo alumno, sesión y fecha | HTTP 429. |

Estos son resultados esperados. Las capturas y respuestas obtenidas durante la ejecución deben utilizarse como evidencia de las pruebas.

## 11. Solución de problemas frecuentes

- **Error de conexión a MySQL:** comprobar que el servicio esté iniciado, que exista `app_qr` y que las credenciales de `.env` sean correctas. Después de modificarlas, ejecutar `php artisan config:clear`.
- **La aplicación Android no conecta con Laravel:** revisar la IP del servidor, la conexión a la misma red, el puerto 8000 y las reglas del firewall. No utilizar `localhost` para acceder desde el teléfono a la computadora.
- **Error de CORS en Web:** revisar que la configuración del backend permita el origen utilizado por Ionic.
- **La cámara no abre:** comprobar el permiso de cámara, ejecutar la aplicación en Android y sincronizar los complementos con `npx cap sync android`.
- **Las cuentas demo no funcionan:** comprobar que los seeders se hayan ejecutado y que el cliente se conecte a la base de datos del servidor configurado.
- **Los cambios no aparecen en Android:** ejecutar `ionic build`, después `npx cap sync android` y volver a ejecutar la aplicación desde Android Studio.