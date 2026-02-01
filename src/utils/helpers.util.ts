import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

import type { MenuLinks } from './menu.config';
import { differenceInBusinessDays } from 'date-fns';

export function generateMenu(
  menuConfig: MenuLinks[],
  userPermissions: string[],
): MenuLinks[] {
  return menuConfig
    .filter((item) =>
      item.subLinks
        ? true // keep parent if any child matches
        : item.permissions?.some((p) => userPermissions.includes(p)),
    )
    .map((item) => {
      if (item.subLinks) {
        const allowedChildren = generateMenu(item.subLinks, userPermissions);
        return allowedChildren.length > 0
          ? { ...item, subLinks: allowedChildren }
          : null;
      }
      return item.permissions?.some((p) => userPermissions.includes(p))
        ? item
        : null;
    })
    .filter((item) => item !== null);
}

export function hashPassword(password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  return hash;
}

export function comparePassword(password: string, hash: string) {
  return compareSync(password, hash);
}

export function getDaysCount(startDate: Date, endDate: Date) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) return 0;
  return differenceInBusinessDays(end, start) + 1;
}
