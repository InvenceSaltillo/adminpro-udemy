import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor( public usuarioService: UsuarioService ) { }

  canActivate(): Promise<boolean> | boolean {

    console.log( 'Inicio de Verifica tokenGuard' );

    const token = this.usuarioService.token;

    const payload = JSON.parse( atob( token.split( '.' )[1] ) );

    const expirado = this.expirado( payload.exp );

    if ( expirado ) {
      this.usuarioService.logout();
      return false;
    }

    return this.verificaRenueva( payload.exp );

  }

  verificaRenueva( fechaExp: number ): Promise<boolean> {

    return new Promise( ( resolve, reject ) => {

      const tokenExp = new Date( fechaExp * 1000 );
      const ahora = new Date();

      ahora.setTime( ahora.getTime() + ( 1 * 60 * 60 * 1000 ) );

      if ( tokenExp.getTime() > ahora.getTime() ) {

        resolve( true );

      } else {

        this.usuarioService.renuevaToken().subscribe( () => {
          resolve( true );
        }, () =>  {
          reject(false);
          this.usuarioService.logout();
        } );

      }

      resolve( true );

    });

  }

  expirado( fechaExp: number ) {

    const ahora = new Date().getTime() / 1000;

    if ( fechaExp < ahora ) {
      return true;
    } else {
      return false;
    }
  }

}
