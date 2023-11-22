import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';

interface ActivityLogItem {
  action: string;
  userId: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class ActivityTrackerService {
  private activityLog: ActivityLogItem[] = [];
  private blockedUsers: Set<number> = new Set();
  public isUserBlockedSubject = new BehaviorSubject<boolean>(false);
  public isCaptchaBlockedSubject = new BehaviorSubject<boolean>(false);
  public isCaptchaBlocked = this.isCaptchaBlockedSubject.asObservable();

  constructor(private userService: UserService) {
    const isUserBlocked = localStorage.getItem('isUserBlocked');
    if (isUserBlocked === 'true') {
      this.blockUser(Number(localStorage.getItem('blockedUserId')));
    }
    const isCaptchaBlocked = localStorage.getItem('isCaptchaBlocked');
    if (isCaptchaBlocked === 'true') {
      this.isCaptchaBlockedSubject.next(true);
    }
  }

  logActivity(action: string, userId: number) {
    const timestamp = Date.now();
    this.activityLog.push({ action, userId, timestamp });
    console.log(
      `Logged activity: Action "${action}" for User ID ${userId} at ${new Date(
        timestamp
      )}`
    );
  }

  analyzeActivity(userId: number): boolean {
    const clickThreshold = 3;
    const timeThreshold = 5000;

    const userActivities = this.activityLog.filter(
      (activity) => activity.userId === userId
    );
    if (userActivities.length < clickThreshold) {
      return false;
    }

    const clickIntervals = [];
    for (let i = 1; i < userActivities.length; i++) {
      const interval =
        userActivities[i].timestamp - userActivities[i - 1].timestamp;
      clickIntervals.push(interval);
    }

    const averageInterval =
      clickIntervals.reduce((sum, interval) => sum + interval, 0) /
      clickIntervals.length;
    if (averageInterval < timeThreshold) {
      return true;
    }

    if (userActivities.length > clickThreshold) {
      return true;
    }

    return false;
  }

  getIsUserBlocked() {
    const observable = this.isUserBlockedSubject.asObservable();
    observable.subscribe((isUserBlocked: boolean) => {});
    return observable;
  }

  getIsCaptchaBlocked() {
    return this.isCaptchaBlockedSubject.value;
  }

  unblockUser(userId: number): void {
    if (this.isUserBlockedSubject.value) {
      this.isUserBlockedSubject.next(false);
    }
    localStorage.setItem('isUserBlocked', 'false');
    localStorage.removeItem('blockedUserId');
  }

  blockUser(userId: number): boolean {
    if (!this.blockedUsers.has(userId) && !this.isCaptchaBlockedSubject.value) {
      const blockedUser = this.userService.getUserById(userId);
      if (blockedUser) {
        blockedUser.isBlocked = true;
        this.userService.updateUser(blockedUser);
        this.blockedUsers.add(userId);
        this.isUserBlockedSubject.next(true);
        localStorage.setItem('isUserBlocked', 'true');
        localStorage.setItem('blockedUserId', userId.toString());
        return true;
      }
    }
    return false;
  }
}
