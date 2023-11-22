import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivityTrackerService } from '../activity-tracker.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-robot-verification',
  templateUrl: './robot-verification.component.html',
  styleUrls: ['./robot-verification.component.css'],
})
export class RobotVerificationComponent {
  public isVerified: boolean = false;
  public isCaptchaFailed: boolean = false;
  public bypassAttempts: number = 0;
  public maxBypassAttempts: number = 3;
  public isUserBlocked: boolean = false;
  public userId!: number;
  public blockExpirationTime: Date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  public isBlockedDueToCaptcha: boolean = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private activityTrackerService: ActivityTrackerService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.userId = this.userService.getUserId();
    this.activityTrackerService
      .getIsUserBlocked()
      .subscribe((isBlocked: boolean) => {
        this.isUserBlocked = isBlocked;
        if (this.isUserBlocked) {
          this.isBlockedDueToCaptcha =
            this.activityTrackerService.getIsCaptchaBlocked();
        }
      });
  }

  private showWarning(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 1000,
    });
  }

  onCaptchaValid(isCaptchaValid: boolean, userId: number) {
    if (isCaptchaValid) {
      this.isVerified = true;
      const isUserUnBlocked = this.activityTrackerService.unblockUser(userId);
      this.activityTrackerService
        .getIsUserBlocked()
        .subscribe((isUserBlocked: boolean) => {
          if (!isUserBlocked) {
            this.router.navigate(['/']);
          }
        });
    } else {
      if (this.bypassAttempts < this.maxBypassAttempts - 1) {
        const warningMessage =
          'Вы не прошли проверку на робота. Пожалуйста, попробуйте снова.';
        this.showWarning(warningMessage);
      }

      this.bypassAttempts++;

      if (this.bypassAttempts >= this.maxBypassAttempts) {
        this.activityTrackerService.blockUser(userId);
        this.isBlockedDueToCaptcha = true;
      }
    }
  }
}
