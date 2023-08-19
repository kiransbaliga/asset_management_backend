import SubCategoryController from "../controller/subcategory.controller";
import dataSource from "../db/postgres.db";
import Category from "../entity/category.entity";
import SubCategory from "../entity/subCategory.entity";
import CategoryRepository from "../repository/category.repository";
import SubCategoryRepository from "../repository/subcategory.repository";
import SubCategoryService from "../service/subcategory.service";

const subcategoryRepository = new SubCategoryRepository(
    dataSource.getRepository(SubCategory)
);

const subcategoryService = new SubCategoryService(subcategoryRepository);

const subcategoryController = new SubCategoryController(subcategoryService);
const subcategoryRoute = subcategoryController.router;

export { subcategoryRoute, subcategoryService };
