import { NextFunction, Response } from "express";
import { RequestWithUser } from "../utils/requestWithUser";
import { Role } from "../utils/role.enum";
import HttpException from "../exceptions/http.exception";

const authorize =
  (requiredRole: Role[]) =>
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const role = req.role;
      if (!requiredRole.includes(role)) {
        throw new HttpException(
          403,
          "You are not authorized to perform this action"
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default authorize;
