import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ViewWillEnter } from '@ionic/angular';
import { timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface Asistencia {
  id: number;
  user_id: number;
  codigo_qr: string;
  sesion?: string;
  grupo?: string;
  fecha: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page implements OnInit, ViewWillEnter {

  asistencias: Asistencia[] = [];
  asistenciasFiltradas: Asistencia[] = [];
  textoBusqueda: string = '';
  cargando: boolean = false;
  esDocente: boolean = false;

  constructor(private http: HttpClient) {}

  private getApiUrl(): string {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8000/api/asistencias';
    }
    return `${environment.apiUrl}/asistencias`;
  }

  ngOnInit() {
    this.verificarRolYCargar();
  }

  ionViewWillEnter() {
    this.verificarRolYCargar();
  }

  verificarRolYCargar() {
    const rol = localStorage.getItem('role');
    this.esDocente = (rol === 'docente');
    this.obtenerAsistencias();
  }

  obtenerAsistencias(event?: any) {
    this.cargando = true;
    const token = localStorage.getItem('token');

    if (!token) {
      this.cargarRegistrosDemo();
      this.cargando = false;
      if (event) event.target.complete();
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = this.getApiUrl();

    this.http.get<Asistencia[]>(url, { headers }).pipe(
      timeout(3000)
    ).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.asistencias = data;
        } else {
          this.cargarRegistrosDemo();
        }
        this.filtrarAsistencias();
        this.cargando = false;
        if (event) event.target.complete();
      },
      error: () => {
        this.cargarRegistrosDemo();
        this.cargando = false;
        if (event) event.target.complete();
      }
    });
  }

  private cargarRegistrosDemo() {
    const hoy = new Date().toISOString().slice(0, 10);
    this.asistencias = [
      {
        id: 1,
        user_id: 2,
        codigo_qr: 'UTGZ|Sesión 1|10° A|1794200000|UTGZ-20261109-1001',
        sesion: 'Sesión 1',
        grupo: '10° A',
        fecha: hoy,
        created_at: new Date().toISOString(),
        user: { id: 2, name: 'David', email: 'david@utgz.edu.mx' }
      },
      {
        id: 2,
        user_id: 3,
        codigo_qr: 'UTGZ|Sesión 1|10° A|1794200000|UTGZ-20261109-1002',
        sesion: 'Sesión 1',
        grupo: '10° A',
        fecha: hoy,
        created_at: new Date(Date.now() - 300000).toISOString(),
        user: { id: 3, name: 'Maria Lopez', email: 'maria@utgz.edu.mx' }
      }
    ];
    this.filtrarAsistencias();
  }

  filtrarAsistencias() {
    if (!this.textoBusqueda.trim()) {
      this.asistenciasFiltradas = [...this.asistencias];
      return;
    }
    const q = this.textoBusqueda.toLowerCase();
    this.asistenciasFiltradas = this.asistencias.filter(item => {
      const nombre = item.user?.name?.toLowerCase() || '';
      const email = item.user?.email?.toLowerCase() || '';
      const sesion = item.sesion?.toLowerCase() || '';
      const grupo = item.grupo?.toLowerCase() || '';
      return nombre.includes(q) || email.includes(q) || sesion.includes(q) || grupo.includes(q);
    });
  }

  doRefresh(event: any) {
    this.obtenerAsistencias(event);
  }
}
