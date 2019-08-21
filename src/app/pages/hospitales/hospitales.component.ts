import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital [] = [];
  desde = 0;

  cargando = false;

  constructor( public hospitalService: HospitalService, public modalUploadService: ModalUploadService ) { }

  ngOnInit() {

    this.cargarHospitales();

    this.modalUploadService.notificacion.subscribe( resp => this.cargarHospitales() );
  }


  cargarHospitales() {

    this.cargando = true;

    this.hospitalService.cargarHospitales( this.desde )
        .subscribe( (res: any ) => {

          this.hospitales = res;
          this.cargando = false;

        });

  }

  obtenerHospital( id: string ) {

  }

  borrarHospital( id: string ) {

    swal({
      title: '¿Esta seguro',
      text: 'Esta a punto de borrar un hospital',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
    .then( borrar => {
      console.log( borrar );

      if ( borrar ) {

        this.hospitalService.borrarHospital( id )
            .subscribe( ( borraro: boolean ) => {
              this.cargarHospitales();
            });
      }
    });

  }

  crearHospital( ) {

    swal({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del hospital',
      icon: 'info',
      buttons: true,
      dangerMode: true,
      content: 'input',

    })
    .then( ( nombre: any ) => {

      if ( !nombre ) {
        console.log( 'No hay nombre' );
        return;
      }

      this.hospitalService.crearHospital( nombre )
          .subscribe( resp => this.cargarHospitales() );

    });

  }

  buscarHospital( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this.hospitalService.buscarHospital( termino )
        .subscribe( ( hospitales: Hospital[] ) => {

          this.hospitales = hospitales;
          this.cargando = false;

        });

  }

  actualizarHospital( hospital: Hospital ) {


    this.hospitalService.actualizarHospital( hospital )
        .subscribe();
  }

  actualizarImagen( hospital: Hospital ) {

    this.modalUploadService.mostraModal( 'hospitales', hospital._id );

  }

  cambiarDesde( valor: number ) {

    const desde = this.desde + valor;

    if ( desde >= this.hospitalService.totalHospitales ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();

  }

}
