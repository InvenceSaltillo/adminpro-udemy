import { Component, OnInit, Input } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';


@Component({
  selector: 'app-grafico-dona',
  templateUrl: './graficoDona.component.html',
  styles: []
})
export class GraficoDonaComponent implements OnInit {


  // Doughnut
  @Input() ChartLabels: Label[] = [];
  @Input() ChartData: MultiDataSet = [];
  @Input() ChartType: ChartType;

  @Input() leyenda = '';

  constructor() { }

  ngOnInit() {
  }

}
