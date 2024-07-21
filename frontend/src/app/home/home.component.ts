import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NgModule } from '@angular/core';

const countdown = (seconds: number) => {
  let remainingTime = seconds;

  const interval = setInterval(() => {
      console.log(remainingTime);
      remainingTime--;

      if (remainingTime < 0) {
          clearInterval(interval);
          console.log('hello');
      }
  }, 1000);
};

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

}



