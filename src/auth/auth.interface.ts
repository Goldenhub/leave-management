export interface IJWTPayload {
  sub: string;
  email: string;
  role: string;
  designation: string;
  permissions: string[];
}
