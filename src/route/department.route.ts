import DepartmentController from "../controller/department.controller";
import dataSource from "../db/postgres.db";
import Department from "../entity/department.entity";
import DepartmentRepository from "../repository/department.repository";
import DepartmentService from "../service/department.service";

import { employeeService } from "./employee.route";

const departmentRepository = new DepartmentRepository(
  dataSource.getRepository(Department)
);

const departmentService = new DepartmentService(
  departmentRepository,
  employeeService
);

const departmentController = new DepartmentController(departmentService);
const departmentRoute = departmentController.router;

export default departmentRoute;
