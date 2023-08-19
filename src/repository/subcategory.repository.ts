import { DataSource, Repository } from "typeorm";
import dataSource from "../db/postgres.db";
import SubCategory from "../entity/subCategory.entity";

class SubCategoryRepository {
    private dataSource: DataSource;

    constructor(private subcategoryRepository: Repository<SubCategory>) {

    }

    findAllSubcategory(offset: number, pageLength: number): Promise<[SubCategory[], number]> {
        return this.subcategoryRepository.findAndCount({
            skip: offset * pageLength,
            take: pageLength,
            select: ["category"]
        });
    }

    findSubcategoryById(id: number): Promise<SubCategory> {
        return this.subcategoryRepository.findOne({
            where: { id: id }
        });
    }

    findSubcategoryByCategoryId(category_id: number): Promise<SubCategory> {
        return this.subcategoryRepository.findOne({
            where: { categoryId: category_id }
        });
    }

    createSubcategory(newSubCategory: SubCategory): Promise<SubCategory> {
        return this.subcategoryRepository.save(newSubCategory);
    }

    updateSubcategoryById(updatedSubCategory: SubCategory): Promise<SubCategory> {
        return this.subcategoryRepository.save(updatedSubCategory);
    }

    deleteSubcategoryById(deletedSubCategory: SubCategory): Promise<SubCategory> {
        return this.subcategoryRepository.softRemove(deletedSubCategory);
    }
}

export default SubCategoryRepository;
