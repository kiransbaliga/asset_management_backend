import { DataSource, Repository } from "typeorm";
import dataSource from "../db/postgres.db";
import Employee from "../entity/employee.entity";
import Category from "../entity/category.entity";

class CategoryRepository {
    private dataSource: DataSource;

    constructor(private categoryRepository: Repository<Category>) {

    }

    findAllCategory(offset: number, pageLength: number): Promise<[Category[], number]> {
        return this.categoryRepository.findAndCount({
            skip: offset * pageLength,
            take: pageLength
        });
    }

    findCategoryById(id: number): Promise<Category> {
        return this.categoryRepository.findOne({
            where: { id: id }
        });
    }

    createCategory(newCategory: Category): Promise<Category> {
        return this.categoryRepository.save(newCategory);
    }

    updateCategoryById(updatedCategory: Category): Promise<Category> {
        return this.categoryRepository.save(updatedCategory);
    }

    deleteCategoryById(deletedCategory: Category): Promise<Category> {
        return this.categoryRepository.softRemove(deletedCategory);
    }
}

export default CategoryRepository;
