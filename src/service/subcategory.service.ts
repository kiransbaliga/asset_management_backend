import CreateSubCategoryDto from "../dto/create-subcategory.dto";
import SetSubCategoryDto from "../dto/set-subcategory.dto";

import Address from "../entity/address.entity";
import SubCategory from "../entity/subCategory.entity";
import HttpException from "../exceptions/http.exception";
import DepartmentRepository from "../repository/category.repository";
import SubCategoryRepository from "../repository/subcategory.repository";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

class SubCategoryService {
    
    constructor(private subcategoryRepository: SubCategoryRepository) {

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

    async getSubCategoryByCategoryId(category_id: number): Promise<SubCategory | null> {
        const subcategory = await this.subcategoryRepository.findSubcategoryByCategoryId(category_id);
        return subcategory;
    }

    async createSubCategory(createSubCategoryDto: CreateSubCategoryDto): Promise<SubCategory> {
        const subcategory = new SubCategory();
        subcategory.name = createSubCategoryDto.name;
        subcategory.categoryId=createSubCategoryDto.categoryId;
        return this.subcategoryRepository.createSubcategory(subcategory);
    }

   
    async updateSubCategoryFieldById(id: number, updateSubCategoryDto: SetSubCategoryDto): Promise<SubCategory> {
        const subcategory = await this.subcategoryRepository.findSubcategoryById(id);
        subcategory.name = updateSubCategoryDto.name;
        subcategory.categoryId=updateSubCategoryDto.categoryId;
        return this.subcategoryRepository.updateSubcategoryById(subcategory);
    }

    async deleteSubCategoryById(id: number): Promise<SubCategory> {
        const subcategory = await this.subcategoryRepository.findSubcategoryById(id);
        return this.subcategoryRepository.deleteSubcategoryById(subcategory);
    }
}

export default SubCategoryService;
