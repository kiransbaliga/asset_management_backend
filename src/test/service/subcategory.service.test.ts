import { DataSource } from "typeorm";
import SubCategoryService from "../../service/subcategory.service";
import Employee from "../../entity/employee.entity";
import { when } from "jest-when";
import * as dotenv from "dotenv";
import HttpException from "../../exceptions/http.exception";
import SubCategoryRepository from "../../repository/subcategory.repository";
import SubCategory from "../../entity/subCategory.entity";
import CreateSubCategoryDto from "../../dto/create-subcategory.dto";
import { plainToInstance } from "class-transformer";
import EmployeeRepository from "../../repository/employee.repository";
import dataSource from "../../db/postgres.db";
import EmployeeService from "../../service/employee.service";
import SubCategoryEmployeeRepository from "../../repository/subcategory.employee.repository";
import SubCategoryEmployee from "../../entity/subcatogery-employee.entity";
import SetSubCategoryDto from "../../dto/set-subcategory.dto";

describe('SubCategory Service Test', () => {
    let subCategoryService: SubCategoryService;
    let subCategoryRepository: SubCategoryRepository;
    let subCategoryEmployeeRepository : SubCategoryEmployeeRepository;
    let employeeService: EmployeeService;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;

       
   
        subCategoryRepository = new SubCategoryRepository(dataSource.getRepository(SubCategory));
        subCategoryEmployeeRepository = new SubCategoryEmployeeRepository(
            dataSource.getRepository(SubCategoryEmployee)
        );
        subCategoryService = new SubCategoryService(subCategoryRepository, subCategoryEmployeeRepository);
    });

    describe('Test for getSubCategoryById', () => {
        test('Test case success for getSubCategoryById for id 1', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(1).mockResolvedValueOnce({ id: 1, name: "Name" });
            subCategoryRepository.findSubcategoryById = mockFunction;
            const subCategory = await subCategoryService.getSubCategoryById(1);
            expect(subCategory).toStrictEqual({ id: 1, name: "Name" });
        });

        test('Test case success for getSubCategoryByCategoryId for id 1', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(1).mockResolvedValueOnce({ id: 1, name: "Name" });
            subCategoryRepository.findSubcategoryByCategoryId = mockFunction;
            const subCategory = await subCategoryService.getSubCategoryByCategoryId(1);
            expect(subCategory).toStrictEqual({ id: 1, name: "Name" });
        });

        test('Test case success for getSubCategoryByEmployeeId for id 1', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(1).mockResolvedValueOnce({ id: 1, name: "Name" });
            subCategoryEmployeeRepository.findSubcategoryByEmployeeId= mockFunction;
            const subCategory = await subCategoryService.getSubCategoryByCategoryId(1);
            expect(subCategory).toStrictEqual({ id: 1, name: "Name" });
        });

        test('Test case failure for getSubCategoryById for id 2', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(2).mockResolvedValueOnce(null);
            subCategoryRepository.findSubcategoryById = mockFunction;
            await expect(subCategoryService.getSubCategoryById(2)).rejects.toThrowError(HttpException);
        });

        test('Test case success for getAllSubCategories', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(0, 1).mockResolvedValueOnce([[{ id: 1, name: "Name" }], 1]);
            subCategoryRepository.findAllSubcategory = mockFunction;
            const [subCategories, total] = await subCategoryService.getAllSubCategories(0, 1);
            expect([subCategories, total]).toStrictEqual([[{ id: 1, name: "Name" }], 1]);
        });

        test('Test case empty for getAllSubCategories', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(0, 1).mockResolvedValueOnce([[], 0]);
            subCategoryRepository.findAllSubcategory = mockFunction;
            const [subCategories, total] = await subCategoryService.getAllSubCategories(0, 1);
            expect([subCategories, total]).toStrictEqual([[], 0]);
        });

        test('Test case success for createSubCategory', async () => {
            const subCategory_body = {
                name: "name",
                categoryId:1
            };
            const sample_subCategory = new SubCategory();
            const mockFunction = jest.fn();
            const createSubCategoryDto = plainToInstance(CreateSubCategoryDto, subCategory_body);
            sample_subCategory.name = createSubCategoryDto.name;
            sample_subCategory.categoryId = createSubCategoryDto.categoryId;
            when(mockFunction).calledWith(sample_subCategory).mockResolvedValue({ id: 1, name: "name" });
            subCategoryRepository.createSubcategory = mockFunction;
            const subCategory = await subCategoryService.createSubCategory(createSubCategoryDto);
            expect(subCategory).toStrictEqual({ id: 1, name: "name" });
        });

        test('Test case success for updateSubCategory with id = 1', async () => {
            const body = {
                name: "name"
            };
        
            const mockFunction_1 = jest.fn();
            when(mockFunction_1).calledWith(1).mockResolvedValueOnce({ id: 1, name: "OLD NAME" });
            subCategoryRepository.findSubcategoryById = mockFunction_1;
        
            const mockFunction_2 = jest.fn();
            when(mockFunction_2).mockResolvedValue({ id: 1, name: "name" });
            subCategoryRepository.updateSubcategoryById = mockFunction_2;
        
            const updatedSubCategory = await subCategoryService.updateSubCategoryFieldById(1, plainToInstance(SetSubCategoryDto, body));
        
            expect(updatedSubCategory).toStrictEqual({ id: 1, name: "name" });
        });

        test('Test case success for deleteSubCategory with id = 1', async () => {
            const mockFunction1 = jest.fn();
            when(mockFunction1).calledWith(1).mockResolvedValueOnce({ id: 1, name: "name" });
            subCategoryRepository.findSubcategoryById = mockFunction1;
        
            // const mockFunction2 = jest.fn();
            // when(mockFunction2).calledWith(1).mockResolvedValueOnce(null);
        
            // employeeService.getEmployeeBySubCategoryId = mockFunction2;
        
            const mockFunction3 = jest.fn();
            when(mockFunction3).mockResolvedValue({});
            subCategoryRepository.deleteSubcategoryById = mockFunction3;
        
            const deletedSubCategory = await subCategoryService.deleteSubCategoryById(1);
        
            expect(deletedSubCategory).toStrictEqual({});
        });

        // Other test cases for getSubCategoryById

    });

    // Other describe blocks and test cases

});
