import { Injectable } from '@nestjs/common';
import { PERMISSIONS } from './constants/permissions';

@Injectable()
export class AppService {
  getPermissions() {
    return Object.entries(PERMISSIONS).flatMap(([resource, actions]) =>
      actions.map((action) => `${resource}:${action}`),
    );
  }
}
