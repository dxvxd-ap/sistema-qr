import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter, AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page implements OnInit, ViewWillEnter {

  esDocente: boolean = false;
  qrData: string = '';
  codigoVisible: string = '';
  escaneando: boolean = false;
  private apiUrl = `${environment.apiUrl}/asistencias`;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.evaluarRol();
  }

  ionViewWillEnter() {
    this.evaluarRol();
  }

  evaluarRol() {
    const rol = localStorage.getItem('role');
    this.esDocente = (rol === 'docente');

    if (this.esDocente) {
      this.actualizarQR();
    }
  }

  actualizarQR() {
    const timestamp = Math.floor(Date.now() / 1000);
    const hoy = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const aleatorio = Math.floor(1000 + Math.random() * 9000);
    this.codigoVisible = `UTGZ-${hoy}-${aleatorio}`;
    this.qrData = `UTGZ|Sesión 1|10° A|${timestamp}|${this.codigoVisible}`;
  }

  cerrarSesion() {
    this.detenerEscaner();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  async escanearQR() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });

      if (!status.granted) {
        this.mostrarAlerta('Permiso denegado', 'Debes conceder acceso a la cámara para escanear.');
        return;
      }

      this.escaneando = true;
      document.querySelector('body')?.classList.add('scanner-active');
      await BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      this.detenerEscaner();

      if (result.hasContent) {
        console.log('Código QR detectado:', result.content);
        this.registrarAsistenciaEnBackend(result.content);
      }
    } catch (error) {
      console.error('Error al escanear:', error);
      this.detenerEscaner();
      this.mostrarAlerta('Error', 'No se pudo iniciar la cámara en este dispositivo.');
    }
  }

  detenerEscaner() {
    this.escaneando = false;
    document.querySelector('body')?.classList.remove('scanner-active');
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  registrarAsistenciaEnBackend(codigoQR: string) {
    const token = localStorage.getItem('token');

    if (!token) {
      this.mostrarAlerta('Error', 'No se encontró la sesión del alumno.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post(this.apiUrl, { codigo_qr: codigoQR }, { headers }).subscribe({
      next: (res: any) => {
        this.mostrarAlerta('¡Confirmado!', res.message);
      },
      error: (err) => {
        console.error('Error al registrar asistencia:', err);
        this.mostrarAlerta('Error', err.error?.message || 'No se pudo guardar la asistencia en el servidor.');
      }
    });
  }
}