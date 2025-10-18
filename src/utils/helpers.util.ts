import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export function hashPassword(password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  return hash;
}

export function comparePassword(password: string, hash: string) {
  return compareSync(password, hash);
}
