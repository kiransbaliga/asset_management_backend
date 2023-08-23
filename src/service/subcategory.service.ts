import CreateSubCategoryDto from "../dto/create-subcategory.dto";
import SetSubCategoryDto from "../dto/set-subcategory.dto";

import Address from "../entity/address.entity";
import SubCategory from "../entity/subCategory.entity";
import SubCategoryEmployee from "../entity/subcatogery-employee.entity";
import HttpException from "../exceptions/http.exception";
import DepartmentRepository from "../repository/category.repository";
import SubCategoryEmployeeRepository from "../repository/subcategory.employee.repository";
import SubCategoryRepository from "../repository/subcategory.repository";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

class SubCategoryService {
    
    constructor(private subcategoryRepository: SubCategoryRepository,private subcategoryEmployeeRepository: SubCategoryEmployeeRepository) {

    }

    getAllSubCategories(offset: number, pageLength: number): Promise<[SubCategory[], number]> {
        return this.subcategoryRepository.findAllSubcategory(offset, pageLength);
    }

    async getSubCategoryById(id: number): Promise<SubCategory | null> {
        const subcategory = await this.subcategoryRepository.findSubcategoryById(id);
        if (!subcategory) {
            throw new HttpException(404, `SubCategory not Found with id:${id}`);
        }
        return subcategory;
    }



    async getSubCategoryByCategoryId(category_id: number): Promise<[SubCategory[],number]> {
         
        return this.subcategoryRepository.findSubcategoryByCategoryId(category_id);
    }
    async getSubCategoryByEmployeeId(employee_id: number): Promise<[SubCategoryEmployee[],number]> {
        try{
            return this.subcategoryEmployeeRepository.findSubcategoryByEmployeeId(employee_id);
        }
        catch(e)
        {
            throw new HttpException(404, `SubCategory not Found with id:${employee_id}`);   
        }
         
        
    }

    async createSubCategory(createSubCategoryDto: CreateSubCategoryDto): Promise<SubCategory> {
        const subcategory = new SubCategory();
        subcategory.name = createSubCategoryDto.name;
        subcategory.categoryId=createSubCategoryDto.categoryId;
        subcategory.perishable=createSubCategoryDto.perishable;
        if(subcategory.perishable)
        subcategory.count=createSubCategoryDto.count;


        return this.subcategoryRepository.createSubcategory(subcategory);
    }

   
    async updateSubCategoryFieldById(id: number, updateSubCategoryDto: SetSubCategoryDto,count=-1): Promise<SubCategory> {
        const subcategory = await this.subcategoryRepository.findSubcategoryById(id);
        subcategory.name = updateSubCategoryDto.name;
        subcategory.categoryId=updateSubCategoryDto.categoryId;
        if(subcategory.perishable&&count!=-1)
        {
            subcategory.count=subcategory.count-count;
        }
        return this.subcategoryRepository.updateSubcategoryById(subcategory);
    }

    async deleteSubCategoryById(id: number): Promise<SubCategory> {
        const subcategory = await this.subcategoryRepository.findSubcategoryById(id);
        return this.subcategoryRepository.deleteSubcategoryById(subcategory);
    }
}

export default SubCategoryService;
