import { IUser } from "../modules/user/user.types";

declare global {
  namespace Express {
    interface User extends IUser {
      note?: string;
    }

    interface Request {
      user?: User;
    }
  }
}
