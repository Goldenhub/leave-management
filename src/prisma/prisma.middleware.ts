import { PrismaClient } from 'generated/prisma';
import { hashPassword } from '../utils/helpers.util';

const prisma = new PrismaClient().$extends({
  query: {
    employee: {
      create({ args, query }) {
        if (args.data.password) {
          args.data.password = hashPassword(args.data.password);
        }
        return query(args);
      },
      update({ args, query }) {
        if (args.data.password) {
          args.data.password = hashPassword(args.data.password as string);
        }
        return query(args);
      },
    },
  },
});

export default prisma;
