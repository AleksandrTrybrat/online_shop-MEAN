export class User {
  id: number;
  username: string;
  isBlocked: boolean = false;
  blockedUntil?: Date | undefined;

  constructor(id: number, username: string) {
    this.id = id;
    this.username = username;
  }
}
