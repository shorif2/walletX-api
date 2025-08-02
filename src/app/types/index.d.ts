import { IUser, Role } from "../modules/user/user.types";

declare global {
  namespace Express {
    interface User {
      _id?: Types.ObjectId;
      role?: Role;
      note?: string;
    }

    interface Request {
      user?: User | IUser;
    }
  }
}
