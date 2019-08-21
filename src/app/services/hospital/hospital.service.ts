import { Injectable } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales = 0;

  constructor( private http: HttpClient, public usuarioService: UsuarioService ) { }

  cargarHospitales( desde = 0 ) {

    const url = URL_SERVICIOS + '/hospital?desde=' + desde;

    return this.http.get( url )
              .pipe( map( (resp: any ) => {
                this.totalHospitales = resp.total;
                return resp.hospitales;
              }));

  }

  obtenerHospital( id: string ) {

    const url = URL_SERVICIOS + '/hospital/' + id;

    return this.http.get( url )
              .pipe( map( ( resp: any ) => resp.hospital ) );

  }

  borrarHospital( id: string ) {

    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this.usuarioService.token;

    return this.http.delete( url )
                .pipe( map( resp => {
                  swal( 'Hospital borrado', 'El hospital a sido eliminado correctamente', 'success' );
                  return true;
                }));

  }

  crearHospital( nombre: string ) {

    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this.usuarioService.token;

    return this.http.post( url, { nombre } )
    .pipe( map( (resp: any ) => {

      swal( 'Hospital creado', nombre, 'success');
      console.log( resp ) ;

      return resp.hospital;

    }));

  }

  buscarHospital( termino: string ) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;

    return this.http.get( url )
               .pipe( map( (resp: any ) => resp.hospitales )) ;
  }

  actualizarHospital( hospital: Hospital ) {

    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this.usuarioService.token;

    return this.http.put( url, hospital )
                .pipe( map( ( resp: any ) => {

                    console.log( resp );
                    swal( 'Hospital actualizado', hospital.nombre, 'success' );

                    return resp.hospital;


                }));
  }

}
