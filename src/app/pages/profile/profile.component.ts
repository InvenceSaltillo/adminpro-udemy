import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuarios.model';
import { UsuarioService } from '../../services/service.index';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;

  imagenSubir: File;
  imagenTemp: string;

  constructor( public usuarioService: UsuarioService ) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit() {
  }

  guardar( usuario: Usuario ) {

    this.usuario.nombre = usuario.nombre;

    if ( !this.usuario.google ) {
      this.usuario.email = usuario.email;
    }

    this.usuarioService.actualizarUsuario( this.usuario )
        .subscribe( );

  }

  seleccionImagen( archivo: File ) {

    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if ( archivo.type.indexOf( 'image' ) ) {
      sweetAlert( 'Solo imagenes', 'El archivo seleccionado no es una imagen', 'error' );
      this.imagenSubir = null;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result.toString();
  }

  cambiarImagen() {

    this.usuarioService.cambiarImagen( this.imagenSubir, this.usuario._id );

  }

}
