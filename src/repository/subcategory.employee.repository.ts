import { DataSource, Repository } from "typeorm";
import dataSource from "../db/postgres.db";
import SubCategory from "../entity/subCategory.entity";
import SubCategoryEmployee from "../entity/subcatogery-employee.entity";

class SubCategoryEmployeeRepository {
    private dataSource: DataSource;

    constructor(private subcategoryEmployeeRepository: Repository<SubCategoryEmployee>) {

    }

    findAllSubcategoryEmployee(offset: number, pageLength: number): Promise<[SubCategoryEmployee[], number]> {
        return this.subcategoryEmployeeRepository.findAndCount({
            skip: offset * pageLength,
            take: pageLength,
        });
    }

  
    createSubcategoryEmployee(newSubCategoryEmployee: SubCategoryEmployee): Promise<SubCategoryEmployee> {
        return this.subcategoryEmployeeRepository.save(newSubCategoryEmployee);
    }

    updateSubcategoryEmployeeById(updatedSubCategory: SubCategoryEmployee): Promise<SubCategoryEmployee> {
        return this.subcategoryEmployeeRepository.save(updatedSubCategory);
    }

    deleteSubcategoryEmployeeById(deletedSubCategory: SubCategory): Promise<SubCategoryEmployee> {
        return this.subcategoryEmployeeRepository.softRemove(deletedSubCategory);
    }
}

export default SubCategoryEmployeeRepository;
