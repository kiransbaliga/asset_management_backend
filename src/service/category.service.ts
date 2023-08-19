import CreateCategoryDto from "../dto/create-category.dto";
import UpdateCategoryDto from "../dto/update-category.dto";
import Category from "../entity/category.entity";
import HttpException from "../exceptions/http.exception";
import CategoryRepository from "../repository/category.repository";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import EmployeeService from "./employee.service";
import EmployeeRepository from "../repository/employee.repository";
import dataSource from "../db/postgres.db";
import Employee from "../entity/employee.entity";

class CategoryService {
    
    constructor(private categoryRepository: CategoryRepository, private employeeService: EmployeeService) {

    }

    getAllCategory(offset: number, pageLength: number): Promise<[Category[], number]> {
        return this.categoryRepository.findAllCategory(offset, pageLength);
    }

    async getCategoryById(id: number): Promise<Category | null> {
        const category = await this.categoryRepository.findCategoryById(id);
        if (!category) {
            throw new HttpException(404, `Category not Found with id:${id}`);
        }
        return category;
    }

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = new Category();
        category.name = createCategoryDto.name;
        return this.categoryRepository.createCategory(category);
    }

    async updateCategoryById(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.categoryRepository.findCategoryById(id);
        category.name = updateCategoryDto.name;

        return this.categoryRepository.updateCategoryById(category);
    }

    async deleteCategoryById(id: number): Promise<Category> {
        const category = await this.categoryRepository.findCategoryById(id);
        return this.categoryRepository.deleteCategoryById(category);
    }
}

export default CategoryService;
