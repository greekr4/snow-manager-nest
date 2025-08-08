export class CreateUserDto {
  adminKey: string;
  adminId?: string;
  adminPw?: string;
  adminName?: string;
  adminPosition?: string;
  pushToken?: string;
  pushEnabled?: boolean;
}
