import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }


  subirArchivo( archivo: File, tipoImagen: string, id: string ) {

    return new Promise ( ( resolve, reject ) => {

      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append( 'imagen', archivo, archivo.name );

      xhr.onreadystatechange = () => {

        if ( xhr.readyState === 4 ) {

          if ( xhr.status === 200 ) {
            console.log( 'Imagen subida' );
            resolve( JSON.parse( xhr.response ) );
          } else {
            console.log( 'Fallo la subida' );
            reject( JSON.parse( xhr.response ) );
          }

        }

      };

      const url = URL_SERVICIOS + '/upload/' + tipoImagen + '/' + id;

      xhr.open( 'PUT', url, true );
      xhr.send( formData );

    });


  }

  // fileUpload(fileItem: File, tipo: string, id: string) {
  //   const url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;
  //   const formData: FormData = new FormData();
  //   formData.append('imagen', fileItem, fileItem.name);
  //   return this.http.put(url, formData, { reportProgress: true });
  //   }

}
