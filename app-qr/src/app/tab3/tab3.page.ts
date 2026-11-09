import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit, ViewWillEnter {

  nombre: string = '';
  correo: string = '';
  rol: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.cargarDatos();
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.nombre = localStorage.getItem('user_name') || 'Usuario UTGZ';
    this.correo = localStorage.getItem('user_email') || 'usuario@utgz.edu.mx';
    this.rol = localStorage.getItem('role') || 'estudiante';
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
