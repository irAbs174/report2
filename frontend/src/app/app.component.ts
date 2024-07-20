import { ScrollProgressBarComponent } from './scroll-progress-bar/scroll-progress-bar.component';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { PhoneNumberService } from './api-client.service';
import { RouterOutlet, Router } from '@angular/router';
import {HomeComponent} from './home/home.component';
import { LoadingService } from './loading.service';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScrollProgressBarComponent, FormsModule, HomeComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  enterNumber = false;
  VerificationDigits = true;
  home = true;

  phoneNumber: string = '';
  verificationCode: string[] = ['', '', '', ''];

  constructor(
    private loadingService: LoadingService,
    private phoneNumberService: PhoneNumberService,
    private renderer: Renderer2,
    private router: Router
  ) {}

  sendPhoneNumber() {
    this.loadingService.simulateLoading();
    const formattedPhoneNumbers = this.formatPhoneNumber(this.phoneNumber);
    this.phoneNumberService.sendPhoneNumbers(formattedPhoneNumbers)
      .then(() => {
        console.log('Phone numbers sent successfully');
        this.VerificationDigits = false; // Show verification box after sending phone numbers
      })
      .catch((error) => {
        console.error('Error sending phone numbers:', error);
      });
  }

  formatPhoneNumber(phoneNumber: string): string[] {
    // Example formatting - adjust as needed
    const format1 = phoneNumber; // Original format
    const format2 = phoneNumber.startsWith('0') ? `+98${phoneNumber.slice(1)}` : phoneNumber; // International format with +98
    const format3 = phoneNumber.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3'); // Dashed format

    return [format1, format2, format3];
  }

  digits_set(index: number, event: any) {
    const submitButton = this.renderer.selectRootElement('#submit_digits', true);
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    if (event.inputType === 'deleteContentBackward') {
      this.verificationCode[index] = '';
      this.moveToPrevious(index);
    }else if (index < this.verificationCode.length) {
      this.verificationCode[index] = value;
      this.moveToNext(index, '1');
    }

    // Check if all digits have been entered
    if (this.verificationCode.every(digit => digit !== '')) {
      this.verifyCode(this.verificationCode);
    }
  }

  verifyCode(code: string[]) {
    axios.post('https://google.com/verify', { code })
      .then(response => {
        console.log('Verification code sent successfully!');
      })
      .catch(error => {
        this.VerificationDigits = false;
        this.enterNumber = false;
        this.router.navigate(['/home']);
        this.home = true;
        this.loadingService.simulateLoading();
        console.error('Error sending verification code:', error);
      });
  }


  moveToNext(index: number, value: string) {
    if (value && index < this.verificationCode.length - 1) {
      const nextInput = this.renderer.selectRootElement(`input[data-index='${index + 1}']`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  moveToPrevious(index: number) {
    if (index > 0) {
      const previousInput = this.renderer.selectRootElement(`input[data-index='${index - 1}']`, true) as HTMLInputElement;
      if (previousInput) {
        previousInput.focus();
      }
    }
  }

  ngOnInit() {
    this.loadingService.simulateLoading();
  }
}
