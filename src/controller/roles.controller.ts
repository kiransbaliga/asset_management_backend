import express, { NextFunction } from "express";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import { Role } from "../utils/role.enum";
import createResponse from "../utils/createResponse";
class RolesController {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.router.get(
      "/",
      authenticate,
      authorize([Role.HR, Role.Admin]),
      this.getAllRoles
    );
  }
  getAllRoles = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const roles = Role;
      const data = Object.values(roles);
      const rolesObj = {
        data: data,
      };

      res.status(200).send(createResponse(rolesObj, "OK", null, data.length));
    } catch (error) {
      next(error);
    }
  };
}

export default RolesController;
