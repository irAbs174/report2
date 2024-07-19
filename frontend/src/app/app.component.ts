import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollProgressBarComponent } from './scroll-progress-bar/scroll-progress-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScrollProgressBarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  showVerification = false;

  moveToNext(event: any, nextElement: any) {
    if (event.target.value.length === 1) {
      nextElement.focus();
    }
  }

  send_data() {
    this.showVerification = true;
  }
}
