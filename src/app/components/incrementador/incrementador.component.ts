import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress', {read: '', static: true }) txtProgress: ElementRef;

  @Input('nombre') leyenda = 'Leyenda';
  @Input() progreso = 50;

  @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() {
    // console.log('Leyenda', this.leyenda );
    // console.log('Progreso', this.progreso );
  }

  ngOnInit() {
    // console.log('Leyenda', this.leyenda );
    // console.log('Progreso', this.progreso );
  }

  onChange( newValue: number) {

    console.log('newValue', newValue);

    // const elemHtml: any = document.getElementsByName('progreso')[0];
    // console.log( elemHtml.value );

    if ( this.progreso >= 100) {
      this.progreso = 100;
    } else if ( this.progreso <= 0 ) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;

    }

    // elemHtml.value = this.progreso;

    this.txtProgress.nativeElement.value = this.progreso;

    this.cambioValor.emit( this.progreso );

  }

  cambiarValor( valor: number ) {

    if ( this.progreso >= 100 && valor > 0) {
      this.progreso = 100;
      return;
    }
    if ( this.progreso <= 0 && valor < 0 ) {
      this.progreso = 0;
      return;
    }

    this.progreso = this.progreso + valor;

    this.cambioValor.emit( this.progreso );

    this.txtProgress.nativeElement.focus();

  }

}