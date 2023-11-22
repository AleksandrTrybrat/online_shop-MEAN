import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'OnlineShop';

  isDarkEnable = false;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');


    if (savedTheme === 'dark' || savedTheme === 'light') {
      this.isDarkEnable = savedTheme === 'dark';
    } else {
      // иначе используем настройку из браузера
      this.isDarkEnable = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Применяем стили в зависимости от выбранной темы
    if (this.isDarkEnable) {
      this.renderer.addClass(document.body, 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark');
    }
  }

  changeTheme() {
    this.isDarkEnable = !this.isDarkEnable;
    const theme = this.isDarkEnable ? 'dark' : 'light';
    localStorage.setItem('theme', theme);

    // Применяем стили в зависимости от выбранной темы
    if (this.isDarkEnable) {
      this.renderer.addClass(document.body, 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark');
    }
  }


  openCloseBar = true;
  hidden = 'hidden';
  openMenu() {
    this.openCloseBar = !this.openCloseBar;
    console.log(this.openCloseBar);
    if (this.openCloseBar === false) {
      this.hidden = 'contents';
    } else {
      this.hidden = 'hidden';
    }
  }
}
