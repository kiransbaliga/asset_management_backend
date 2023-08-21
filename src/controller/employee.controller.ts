import express, { NextFunction } from "express";
import EmployeeService from "../service/employee.service";
import { plainToInstance } from "class-transformer";
import CreateEmployeeDto from "../dto/create-employee.dto";
import { validate } from "class-validator";
import ValidationException from "../exceptions/validation.errors";
import UpdateEmployeeDto from "../dto/update-employee.dto";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import { Role } from "../utils/role.enum";
import SetEmployeeDto from "../dto/set-employee.dto";
import createResponse from "../utils/createResponse";
import logger from "../utils/winston.logger";

class EmployeeController {
  public router: express.Router;

  constructor(private employeeService: EmployeeService) {
    this.router = express.Router();

    this.router.get("/", authenticate, this.getAllEmployees);
    this.router.get("/:id", authenticate, this.getEmployeeById);
    this.router.post(
      "/",
      // authenticate,
      // authorize([Role.HR, Role.Admin]),
      this.createEmployee
    );
    this.router.put(
      "/:id",
      // authenticate,
      // authorize([Role.HR, Role.Admin]),
      this.updateEmployee
    );
    this.router.delete(
      "/:id",
      // authenticate,
      // authorize([Role.HR, Role.Admin]),
      this.deleteEmployee
    );
    this.router.patch("/:id", this.updateEmployeeField);
    this.router.post("/login", this.loginEmployee);
  }
  getAllEmployees = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const offset = Number(req.query.offset ? req.query.offset : 0);
      const pageLength = Number(req.query.length ? req.query.length : 10);
      const [employees, total] = await this.employeeService.getAllEmployees(
        offset,
        pageLength
      );
      res.status(200).send(createResponse(employees, "0K", null, total));
      logger.info("Recieved All Departments");
    } catch (error) {
      next(error);
    }
  };
  getEmployeeById = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id);
      const employees = await this.employeeService.getEmployeeById(employeeId);
      res.status(200).send(createResponse(employees, "0K", null, 1));
      logger.info(`Recieved Department with id ${employees.id}`);
    } catch (error) {
      next(error);
    }
  };
  createEmployee = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
      const errors = await validate(createEmployeeDto);
      if (errors.length > 0) {
        throw new ValidationException(400, "Validation Errors", errors);

        //throw new PropertyRequiredError("Name not found");
      } else {
        const employee = await this.employeeService.createEmployee(
          createEmployeeDto
        );

        res.status(201).send(createResponse(employee, "0K", null, 1));
        logger.info(`Created Department with id ${employee.id}`);
      }
    } catch (error) {
      next(error);
    }
  };
  updateEmployee = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const updateEmployeeDto = plainToInstance(UpdateEmployeeDto, req.body);
      const errors = await validate(updateEmployeeDto);
      if (errors.length > 0) {
        throw new ValidationException(400, "Validation Errors", errors);
      }

      const employee = await this.employeeService.updateEmployeeById(
        id,
        updateEmployeeDto
      );
      res.status(201).send(createResponse(employee, "0K", null, 1));
      logger.info(`Created Department with id ${employee.id}`);
    } catch (error) {
      next(error);
    }
  };

  updateEmployeeField = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const setEmployeeDto = plainToInstance(SetEmployeeDto, req.body);
      const errors = await validate(setEmployeeDto);
      if (errors.length > 0) {
        throw new ValidationException(400, "Validation Errors", errors);
      }

      const employee = await this.employeeService.updateEmployeeFieldById(
        id,
        setEmployeeDto
      );
      res.status(201).send(createResponse(employee, "0K", null, 1));
      logger.info(`Created Department with id ${employee.id}`);
    } catch (error) {
      next(error);
    }
  };
  deleteEmployee = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id);
      await this.employeeService.deleteEmployeeById(employeeId);
      res.status(204).send("employee deleted");
      logger.info(`Created Department with id ${employeeId}`);
    } catch (error) {
      next(error);
    }
  };

  public loginEmployee = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { username, password } = req.body;
    try {
      const token = await this.employeeService.loginEmployee(
        username,
        password
      );
      res.status(200).send(createResponse(token, "OK", null, 1));
      logger.info(`Logged in User ${username}`);
    } catch (error) {
      next(error);
    }
  };
}

export default EmployeeController;
