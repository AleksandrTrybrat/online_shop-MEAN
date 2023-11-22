import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotVerificationComponent } from './robot-verification.component';

describe('RobotVerificationComponent', () => {
  let component: RobotVerificationComponent;
  let fixture: ComponentFixture<RobotVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RobotVerificationComponent]
    });
    fixture = TestBed.createComponent(RobotVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
