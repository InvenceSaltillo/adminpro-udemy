import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuarios.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';

import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu = [];

  constructor( public http: HttpClient, public router: Router, public subirArchivoService: SubirArchivoService ) {
    this.cargarStorage();
  }

  renuevaToken() {

    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.token;

    return this.http.get( url )
                .pipe( map( (resp: any) => {

                  this.token = resp.token;
                  localStorage.setItem( 'token', this.token );
                  console.log( 'Token renovado' );

                  return true;

                }), catchError( e => {

                  swal( 'No se pudo renovar token', 'No fue posible renovar token', 'error');
                  this.logout();
                  return throwError(e);
                }));

  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {

    if ( localStorage.getItem( 'token' ) ) {
      this.token = localStorage.getItem( 'token' );
      this.usuario = JSON.parse( localStorage.getItem( 'usuario' ) );
      this.menu = JSON.parse( localStorage.getItem( 'menu' ) );
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario, menu: any ) {

    localStorage.setItem( 'id', id );
    localStorage.setItem( 'token', token );
    localStorage.setItem( 'usuario', JSON.stringify( usuario ) );
    localStorage.setItem( 'menu', JSON.stringify( menu ) );

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  loginGoogle( token: string ) {

    const url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token } )
                .pipe( map( ( resp: any ) => {
                  this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu);
                  return true;
                }));

  }

  login( usuario: Usuario, recordar = false ) {

    if ( recordar ) {
      localStorage.setItem('email', usuario.email );
    } else {
      localStorage.removeItem( 'email' );
    }

    const url = URL_SERVICIOS + '/login';

    return this.http.post( url, usuario )
                    .pipe( map( (resp: any ) => {
                      this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );
                      return true;

                    }), catchError( e => {
                      console.log( 'Error', e.status );
                      swal( 'Error en el login', e.error.mensaje, 'error');
                      return throwError(e);
                    }));


  }

  logout() {

    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate( ['/login'] );
  }

  crearUsuario( usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
    .pipe( map( (resp: any ) => {

      swal( 'Usuario creado', usuario.email, 'success');

      return resp.usuario;

    }), catchError( e => {
      console.log( 'Error', e.status );
      swal( e.error.mensaje, e.error.err.message, 'error');
      return throwError(e);
    }));

  }

  actualizarUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario )
                .pipe( map( ( resp: any ) => {

                  if ( usuario._id === this.usuario._id ) {

                    const usuarioDB: Usuario = resp.usuario;

                    this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu );
                  }

                  swal( 'Usuario actualizado', usuario.nombre, 'success' );

                  return true;

                }), catchError( e => {
                  console.log( 'Error', e.status );
                  swal( e.error.mensaje, e.error.err.message, 'error');
                  return throwError(e);
                }));

  }

  cambiarImagen( archivo: File, id: string ) {

    this.subirArchivoService.subirArchivo( archivo, 'usuarios', id )
        .then( ( resp: any ) => {

          this.usuario.img = resp.usuario.img;

          swal( 'Imagen actualizada', resp.usuario.nombre, 'success' );

          this.guardarStorage( id, this.token, this.usuario, this.menu );

        })
        .catch( resp => {
          console.log( resp );
          swal( 'No se actualizo la imagen', resp.usuario.nombre, 'error' );
        });
  }

  cargarUsuarios( desde = 0 ) {

    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get( url );

  }

  buscarUsuarios( termino: string ) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

    return this.http.get( url )
               .pipe( map( (resp: any ) => resp.usuarios ));

  }

  borrarUsuario( id: string ) {

    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete( url )
                .pipe( map( resp => {
                  swal( 'Usuario borrado', 'El usuario a sido eliminado correctamente', 'success' );
                  return true;
                }));
  }

}
