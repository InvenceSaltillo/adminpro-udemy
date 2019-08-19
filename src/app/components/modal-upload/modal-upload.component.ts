import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;

  @ViewChild('inputFile', { static: true }) myInputVariable: ElementRef;

  constructor( public subirArchivoService: SubirArchivoService, public modalUploadService: ModalUploadService ) {}

  ngOnInit() {
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

  subirImagen() {

    this.subirArchivoService.subirArchivo( this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id )
        .then( resp => {

          this.modalUploadService.notificacion.emit( resp );
          this.cerrarModal();

        })
        .catch( err => {
          console.log( 'Error den la carga' );
        });

  }

  cerrarModal() {

    this.imagenSubir = null;
    this.imagenTemp = null;

    this.myInputVariable.nativeElement.value = '';

    this.modalUploadService.ocultarModal();
  }

}
