import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scroll-progress-bar',
  standalone: true,
  templateUrl: './scroll-progress-bar.component.html',
  styleUrls: ['./scroll-progress-bar.component.css'],
})
export class ScrollProgressBarComponent implements OnInit {
  scrollPercentage: number = 0; // Initialize to 0

  constructor() {}

  ngOnInit() {
    this.simulateLoading();
  }

  simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 3;
      this.scrollPercentage = progress;
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100); // Adjust the interval duration as needed
  }
}
