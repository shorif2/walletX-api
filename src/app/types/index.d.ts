import { JwtPayload } from "jsonwebtoken";
import { IUser, Role } from "../modules/user/user.types";

declare global {
  namespace Express {
    interface User {
      _id?: Types.ObjectId;
      role?: Role; // add other custom fields like email, name, etc.
    }

    interface Request {
      user?: User | IUser;
    }
  }
}
