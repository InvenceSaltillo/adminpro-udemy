import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuarios.model';
import { UsuarioService } from 'src/app/services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario [] = [];
  desde = 0;

  totalRegistros = 0;
  cargando = false;

  constructor( public usuarioService: UsuarioService, public modalUploadService: ModalUploadService ) { }

  ngOnInit() {

    this.cargarUsuarios();

    this.modalUploadService.notificacion.subscribe( resp => this.cargarUsuarios() );

  }

  mostrarModal( id: string ) {

    this.modalUploadService.mostraModal( 'usuarios', id );

  }

  cargarUsuarios() {

    this.cargando = true;

    this.usuarioService.cargarUsuarios( this.desde )
        .subscribe( (res: any ) => {

          this.totalRegistros = res.total;
          this.usuarios = res.usuarios;
          this.cargando = false;

        });
  }

  cambiarDesde( valor: number ) {

    const desde = this.desde + valor;
    console.log( desde );

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuario( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.usuarioService.buscarUsuarios( termino )
        .subscribe( (usuarios: Usuario[] ) => {

          this.usuarios = usuarios;
          this.cargando = false;

        });
  }

  borrarUsuario( usuario: Usuario ) {

    if ( usuario._id === this.usuarioService.usuario._id ) {
      swal( 'No puede borrar usuario', 'No se puede borrar a si mismo', 'error' );
      return;
    }

    swal({
      title: '¿Esta seguro',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
    .then( borrar => {
      console.log( borrar );

      if ( borrar ) {

        this.usuarioService.borrarUsuario( usuario._id )
            .subscribe( ( borraro: boolean ) => {
              this.cargarUsuarios();
            });
      }
    });

  }

  guardarUsuario( usuario: Usuario ) {

    this.usuarioService.actualizarUsuario( usuario )
        .subscribe();

  }

}
