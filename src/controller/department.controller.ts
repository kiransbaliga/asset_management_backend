import express, { NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import ValidationException from "../exceptions/validation.errors";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import DepartmentService from "../service/department.service";
import CreateDepartmentDto from "../dto/create-department.dto";
import UpdateDepartmentDto from "../dto/update-department.dto";
import logger from "../utils/winston.logger";
import { Role } from "../utils/role.enum";
import createResponse from "../utils/createResponse";
class DepartmentController {
  public router: express.Router;

  constructor(private departmentService: DepartmentService) {
    this.router = express.Router();
    this.router.get("/", this.getAllDepartment);
    this.router.get("/:id", this.getDepartmentById);
    this.router.post(
      "/",
      authenticate,
      authorize([Role.HR, Role.Admin]),
      this.createDepartment
    );
    this.router.put(
      "/:id",
      authenticate,
      authorize([Role.HR, Role.Admin]),
      this.updateDepartment
    );
    this.router.delete(
      "/:id",
      authenticate,
      authorize([Role.HR, Role.Admin]),
      this.deleteDepartment
    );
  }
  getAllDepartment = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const offset = Number(req.query.offset ? req.query.offset : 0);
      const pageLength = Number(req.query.length ? req.query.length : 10);
      const [departments, total] =
        await this.departmentService.getAllDepartment(offset, pageLength);
      res.status(200).send(createResponse(departments, "OK", null, total));
      logger.info("recieved all departments");
    } catch (error) {
      next(error);
    }
  };
  getDepartmentById = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const departmentId = Number(req.params.id);
      const department = await this.departmentService.getDepartmentById(
        departmentId
      );
      res.status(200).send(createResponse(department, "OK", null, 1));
      logger.info(`Recived Department with ${departmentId}`);
    } catch (error) {
      next(error);
    }
  };
  createDepartment = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const createDepartmentDto = plainToInstance(
        CreateDepartmentDto,
        req.body
      );
      const errors = await validate(createDepartmentDto);
      if (errors.length > 0) {
        throw new ValidationException(400, "Validation Errors", errors);

        //throw new PropertyRequiredError("Name not found");
      } else {
        const department = await this.departmentService.createDepartment(
          createDepartmentDto
        );

        res.status(201).send(createResponse(department, "OK", null, 1));
        logger.info(`Created Department with id ${department.id}`);
      }
    } catch (error) {
      next(error);
    }
  };
  updateDepartment = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const updateDepartmentDto = plainToInstance(
        UpdateDepartmentDto,
        req.body
      );
      const errors = await validate(updateDepartmentDto);
      if (errors.length > 0) {
        throw new ValidationException(400, "Validation Errors", errors);
      }

      const department = await this.departmentService.updateDepartmentById(
        id,
        updateDepartmentDto
      );
      res.status(201).send(createResponse(department, "OK", null, 1));
      logger.info(`Updated Department with id ${department.id}`);
    } catch (error) {
      next(error);
    }
  };
  deleteDepartment = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const departmentId = Number(req.params.id);
      await this.departmentService.deleteDepartmentById(departmentId);
      res.status(204).send("department deleted");
      logger.info(`Deleted Department with id ${departmentId}`);
    } catch (error) {
      next(error);
    }
  };
}

export default DepartmentController;
