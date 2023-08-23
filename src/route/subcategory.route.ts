import SubCategoryController from "../controller/subcategory.controller";
import dataSource from "../db/postgres.db";
import Category from "../entity/category.entity";
import SubCategory from "../entity/subCategory.entity";
import SubCategoryEmployee from "../entity/subcatogery-employee.entity";
import CategoryRepository from "../repository/category.repository";
import SubCategoryEmployeeRepository from "../repository/subcategory.employee.repository";
import SubCategoryRepository from "../repository/subcategory.repository";
import SubCategoryService from "../service/subcategory.service";

const subcategoryRepository = new SubCategoryRepository(
    dataSource.getRepository(SubCategory)
);
const subcategoryEmployeeRepository = new SubCategoryEmployeeRepository(
    dataSource.getRepository(SubCategoryEmployee)
  );
const subcategoryService = new SubCategoryService(subcategoryRepository,subcategoryEmployeeRepository);

const subcategoryController = new SubCategoryController(subcategoryService);
const subcategoryRoute = subcategoryController.router;

export { subcategoryRoute, subcategoryService };
