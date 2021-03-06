import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuarios.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  usuario: Usuario;

  constructor( public sideBarService: SidebarService, public usuarioService: UsuarioService ) { }

  ngOnInit() {
    this.usuario = this.usuarioService.usuario;
    this.sideBarService.cargarMenu();
  }

}
