import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css'],
})
export class CaptchaComponent {
  num1!: number;
  num2!: number;
  userAnswer: number | null = null;
  correctAnswer!: number;
  isCaptchaValid: boolean = false;
  @Output() captchaValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.generateCaptcha();
  }

  generateCaptcha() {
    this.num1 = this.getRandomNumber();
    this.num2 = this.getRandomNumber();
    this.correctAnswer = this.num1 + this.num2;
  }

  getRandomNumber(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  checkAnswer() {
    if (this.userAnswer === this.correctAnswer) {
      this.isCaptchaValid = true;
      this.captchaValid.emit(true);
    } else {
      this.isCaptchaValid = false;
      this.captchaValid.emit(false);
      this.generateCaptcha();
    }

    this.userAnswer = null;
  }
}
