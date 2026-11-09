import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ViewWillEnter } from '@ionic/angular';
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

  private apiUrl = `${environment.apiUrl}/asistencias`;

  constructor(private http: HttpClient) {}

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
      this.cargando = false;
      if (event) event.target.complete();
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<Asistencia[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => {
        this.asistencias = data;
        this.filtrarAsistencias();
        this.cargando = false;
        if (event) event.target.complete();
      },
      error: (err) => {
        console.error('Error al cargar asistencias:', err);
        this.cargando = false;
        if (event) event.target.complete();
      }
    });
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
