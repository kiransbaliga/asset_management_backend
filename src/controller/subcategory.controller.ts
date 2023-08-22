import express, { NextFunction } from "express";
import SubCategoryService from "../service/subcategory.service";

import { Express } from "express";
import { plainToInstance } from "class-transformer";
import CreateSubCategoryDto from "../dto/create-subcategory.dto";
import { ValidationError, validate } from "class-validator";
import PropertyRequiredError from "../exceptions/validation.errors";
import ValidationException from "../exceptions/validation.errors";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import { Role } from "../utils/role.enum";
import SetSubCategoryDto from "../dto/set-subcategory.dto";
import createResponse from "../utils/createResponse";
import logger from "../utils/winston.logger";

class SubCategoryController {
    public router: express.Router;

    constructor(private subcategoryService: SubCategoryService) {
        this.router = express.Router();

        this.router.get("/", authenticate, this.getAllSubcategories);
        this.router.get("/category/:id", authenticate, this.getSubCategoryByCategoryId);
        this.router.get("/:id", authenticate, this.getSubcategoryById);
        this.router.post("/", this.createSubcategory);
        this.router.delete("/:id", authenticate, authorize([Role.Admin]), this.deleteSubcategory);
        this.router.patch("/:id", authenticate, authorize([Role.Admin]),this.updateSubcategoryField);
    }

    getAllSubcategories = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const offset = Number(req.query.offset ? req.query.offset : 0);
            const pageLength = Number(req.query.length ? req.query.length : 10);
            const [subcategories, total] = await this.subcategoryService.getAllSubCategories(offset, pageLength);
            res.status(200).send(createResponse(subcategories, "OK", null, total));
            logger.info('Received All Subcategories');
        } catch (error) {
            next(error);
        }
    }
    getSubCategoryByCategoryId = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const categoryId = Number(req.params.id);
            const [subcategory,total] = await this.subcategoryService.getSubCategoryByCategoryId(categoryId);
            res.status(200).send(createResponse(subcategory, "OK", null, total));
            logger.info(`Received subcategories`);
        } catch (error) {
            next(error);
        }
    }

    getSubcategoryById = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const subcategoryId = Number(req.params.id);
            const subcategory = await this.subcategoryService.getSubCategoryById(subcategoryId);
            res.status(200).send(createResponse(subcategory, "OK", null, 1));
            logger.info(`Received Subcategory with id ${subcategory.id}`);
        } catch (error) {
            next(error);
        }
    }

    createSubcategory = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const createSubCategoryDto = plainToInstance(CreateSubCategoryDto, req.body);
            const errors = await validate(createSubCategoryDto);
            if (errors.length > 0) {
                throw new ValidationException(400, "Validation Errors", errors);
            } else {
                const subcategory = await this.subcategoryService.createSubCategory(createSubCategoryDto);
                res.status(201).send(createResponse(subcategory, "OK", null, 1));
                logger.info(`Created Subcategory with id ${subcategory.id}`);
            }
        } catch (error) {
            next(error);
        }
    }

    updateSubcategoryField = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const setSubCategoryDto = plainToInstance(SetSubCategoryDto, req.body);
            const count = req.body.count? Number(req.body.count) : -1;
            const errors = await validate(setSubCategoryDto);
            if (errors.length > 0) {
                throw new ValidationException(400, "Validation Errors", errors);
            }

            const subcategory = await this.subcategoryService.updateSubCategoryFieldById(id, setSubCategoryDto,count);
            res.status(201).send(createResponse(subcategory, "OK", null, 1));
            logger.info(`Updated Subcategory with id ${subcategory.id}`);
        } catch (error) {
            next(error);
        }
    }

    deleteSubcategory = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const subcategoryId = Number(req.params.id);
            await this.subcategoryService.deleteSubCategoryById(subcategoryId);
            res.status(204).send('Subcategory deleted');
            logger.info(`Deleted Subcategory with id ${subcategoryId}`);
        } catch (error) {
            next(error);
        }
    }
}

export default SubCategoryController;
