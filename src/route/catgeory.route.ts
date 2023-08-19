import CategoryController from "../controller/category.controller";
import EmployeeController from "../controller/employee.controller";
import dataSource from "../db/postgres.db";
import Category from "../entity/category.entity";
import Employee from "../entity/employee.entity";
import CategoryRepository from "../repository/category.repository";
import EmployeeRepository from "../repository/employee.repository";
import CategoryService from "../service/category.service";
import EmployeeService from "../service/employee.service";

import { employeeService } from "./employee.route";

const categoryRepository = new CategoryRepository(
    dataSource.getRepository(Category)
);

const categoryService = new CategoryService(categoryRepository, employeeService);

const categoryController = new CategoryController(categoryService);
const categoryRoute = categoryController.router;

export default categoryRoute;
