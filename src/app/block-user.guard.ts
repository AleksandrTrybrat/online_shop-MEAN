import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActivityTrackerService } from './activity-tracker.service';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable()
export class BlockUserGuard implements CanActivate {
  constructor(
    private activityTrackerService: ActivityTrackerService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | boolean {
    return this.activityTrackerService.getIsUserBlocked().pipe(
      take(1),
      map((isUserBlocked: boolean) => {
        if (isUserBlocked) {
          this.router.navigate(['/robot-verification']);
          return false;
        }
        return true;
      })
    );
  }
}
