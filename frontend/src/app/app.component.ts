import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollProgressBarComponent } from './scroll-progress-bar/scroll-progress-bar.component';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScrollProgressBarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  constructor(private loadingService: LoadingService) {};

  showVerification = false;

  moveToNext(event: any, nextElement: any) {
    if (event.target.value.length === 1) {
      nextElement.focus();
    }
  }

  send_data() {
    this.showVerification = true;
    this.loadingService.simulateLoading();
  }

  ngOnInit(){
    this.loadingService.simulateLoading();
  }
}
