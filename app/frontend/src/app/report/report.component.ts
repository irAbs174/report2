import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../loading.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit  {

  constructor(
    private loadingService: LoadingService
  ){}

  ngOnInit(): void {
    this.loadingService.simulateLoading()
  };

}
