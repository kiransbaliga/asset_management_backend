import { DataSource } from "typeorm";
import CategoryService from "../../service/category.service";
import Employee from "../../entity/employee.entity";
import { when } from "jest-when";
import * as dotenv from "dotenv";
import HttpException from "../../exceptions/http.exception";
import CategoryRepository from "../../repository/category.repository";
import Category from "../../entity/category.entity";
import CreateCategoryDto from "../../dto/create-category.dto";
import { plainToInstance } from "class-transformer";
import UpdateCategoryDto from "../../dto/update-category.dto";
import EmployeeRepository from "../../repository/employee.repository";
import dataSource from "../../db/postgres.db";
import EmployeeService from "../../service/employee.service";

describe('Category Service Test', () => {
    let categoryService: CategoryService;
    let categoryRepository: CategoryRepository;
    let employeeRepository: EmployeeRepository;
    let employeeService: EmployeeService;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;

        employeeRepository = new EmployeeRepository(
            dataSource.getRepository(Employee)
        );
        employeeService= new EmployeeService(employeeRepository);
        categoryRepository = new CategoryRepository(dataSource.getRepository(Category));
        categoryService = new CategoryService(categoryRepository, employeeService);
    });

    describe('Test for getCategoryById', () => {
        test('Test case success for getCategoryById for id 1', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(1).mockResolvedValueOnce({ id: 1, name: "Name" });
            categoryRepository.findCategoryById = mockFunction;
            const category = await categoryService.getCategoryById(1);
            expect(category).toStrictEqual({ id: 1, name: "Name" });
        });
        

        test('Test case failure for getCategoryById for id 2', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(2).mockResolvedValueOnce(null);
            categoryRepository.findCategoryById = mockFunction;
            await expect(categoryService.getCategoryById(2)).rejects.toThrowError(HttpException);
        });

        test('Test case success for getAllCategories', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(0, 1).mockResolvedValueOnce([[{ id: 1, name: "Name" }], 1]);
            categoryRepository.findAllCategory = mockFunction;
            const [categories, total] = await categoryService.getAllCategory(0, 1);
            expect([categories, total]).toStrictEqual([[{ id: 1, name: "Name" }], 1]);
        });

        test('Test case empty for getAllCategories', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(0, 1).mockResolvedValueOnce([[], 0]);
            categoryRepository.findAllCategory = mockFunction;
            const [categories, total] = await categoryService.getAllCategory(0, 1);
            expect([categories, total]).toStrictEqual([[], 0]);
        });

        test('Test case success for createCategory', async () => {
            const category_body = {
                name: "name"
            };
            const sample_category = new Category();
            const mockFunction = jest.fn();
            const createCategoryDto = plainToInstance(CreateCategoryDto, category_body);
            sample_category.name = createCategoryDto.name;
            when(mockFunction).calledWith(sample_category).mockResolvedValue({ id: 1, name: "name" });
            categoryRepository.createCategory = mockFunction;
            const category = await categoryService.createCategory(createCategoryDto);
            expect(category).toStrictEqual({ id: 1, name: "name" });
        });

        test('Test case success for updateCategory with id = 1', async () => {
            const body = {
                name: "name"
            };
        
            const mockFunction_1 = jest.fn();
            when(mockFunction_1).calledWith(1).mockResolvedValueOnce({ id: 1, name: "OLD NAME" });
            categoryRepository.findCategoryById = mockFunction_1;
        
            const mockFunction_2 = jest.fn();
            when(mockFunction_2).mockResolvedValue({ id: 1, name: "name" });
            categoryRepository.updateCategoryById = mockFunction_2;
        
            const updatedCategory = await categoryService.updateCategoryById(1, plainToInstance(UpdateCategoryDto, body));
        
            expect(updatedCategory).toStrictEqual({ id: 1, name: "name" });
        });

        test('Test case success for deleteCategory with id = 1', async () => {
            const mockFunction1 = jest.fn();
            when(mockFunction1).calledWith(1).mockResolvedValueOnce({ id: 1, name: "name" });
            categoryRepository.findCategoryById = mockFunction1;
        
            // const mockFunction2 = jest.fn();
            // when(mockFunction2).calledWith(1).mockResolvedValueOnce(null);
        
            // employeeService.getEmployeeByCategoryId = mockFunction2;
        
            const mockFunction3 = jest.fn();
            when(mockFunction3).mockResolvedValue({});
            categoryRepository.deleteCategoryById = mockFunction3;
        
            const deletedCategory = await categoryService.deleteCategoryById(1);
        
            expect(deletedCategory).toStrictEqual({});
        });
        

        // Other test cases for getCategoryById

    });

  
 
    

});
