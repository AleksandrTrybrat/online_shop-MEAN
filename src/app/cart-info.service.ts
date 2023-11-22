import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartInfoService {
  TELEGRAM_BOT_TOKEN = '5909650256:AAH4yQS7rH4cNtkVp4ERbGrMUmuy_VOTuDU';
  TELEGRAM_CHAT_ID = '-1001670955042';
  private API_URL = `https://api.telegram.org/bot${this.TELEGRAM_BOT_TOKEN}/sendMessage`;

  constructor(private http: HttpClient) {}

  sendMessage(message: string) {
    const data = {
      chat_id: this.TELEGRAM_CHAT_ID,
      text: message
    };

    return this.http.post(this.API_URL, data);
  }
}
