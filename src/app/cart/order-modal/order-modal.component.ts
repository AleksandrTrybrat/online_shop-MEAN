import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.css']
})
export class OrderModalComponent {
  @Input() title: string = 'Уведомление';
  @Input() message: string = '';
  @Input() isOpen: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();

  closeModal() {
    this.closeModalEvent.emit();
  }
}
