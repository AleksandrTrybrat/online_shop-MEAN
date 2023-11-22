import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProductModalComponent } from './delete-product-modal.component';

describe('DeleteProductModalComponent', () => {
  let component: DeleteProductModalComponent;
  let fixture: ComponentFixture<DeleteProductModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteProductModalComponent]
    });
    fixture = TestBed.createComponent(DeleteProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
