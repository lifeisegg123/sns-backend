import { User } from '@prisma/client';

export function getUserWithoutAuthInfo(user: User) {
  const { refreshToken: _, password: __, ...rest } = user;
  return rest;
}
