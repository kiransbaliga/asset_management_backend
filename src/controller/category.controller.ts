import express, { NextFunction } from "express";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import { Role } from "../utils/role.enum";
import createResponse from "../utils/createResponse";
import ValidationException from "../exceptions/validation.errors";
import logger from "../utils/winston.logger";
import CreateCategoryDto from "../dto/create-category.dto";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import UpdateCategoryDto from "../dto/update-category.dto";
import CategoryService from "../service/category.service";
class CategoryController{
    public router : express.Router;

    constructor(private categoryService: CategoryService)
    {
        this.router = express.Router();

        this.router.get("/",this.getAllCategory);
        this.router.get("/:id",this.getCategoryById);
        this.router.post("/",authenticate,authorize([Role.Admin]),this.createCategory);
        this.router.put("/:id",authenticate,authorize([Role.Admin]),this.updateCategory);
        this.router.delete("/:id",authenticate,authorize([Role.HR,Role.Admin]),this.deleteCategory);

    }
    getAllCategory = async (req: express.Request,res:express.Response,next:NextFunction)=> {
        try{
            const offset = Number(req.query.offset ? req.query.offset : 0);
            const pageLength = Number(req.query.length ? req.query.length : 10);
            const [categories,total] = await this.categoryService.getAllCategory(offset,pageLength);
            res.status(200).send(createResponse(categories,"OK",null,total));
            logger.info('recieved all categories');
        }
        catch(error)
        {
            next(error);
        }
        
    }
    getCategoryById = async (req: express.Request,res:express.Response,next:NextFunction)=> {
        try{
            const categoryId = Number(req.params.id);
            const category = await this.categoryService.getCategoryById(categoryId);
            res.status(200).send(createResponse(category ,"OK",null,1));
            logger.info(`Recived category with ${categoryId}`)
        }
        catch(error)
        {
            next(error);
        }
        
    }
    createCategory = async (req: express.Request,res:express.Response,next:NextFunction)=>{

        try{

            
            const createCategoryDto=plainToInstance(CreateCategoryDto,req.body);
            const errors= await validate(createCategoryDto);
            if(errors.length > 0)
            {
                
                throw new ValidationException(400, "Validation Errors", errors);

                //throw new PropertyRequiredError("Name not found");

            }
            else{
                const category = await this.categoryService.createCategory(createCategoryDto);
          
                res.status(201).send(createResponse(category,"OK",null,1));
                logger.info(`Created Category with id ${category.id}`)
            }

            
        }
        catch(error)
        {
            
            next(error);
        }
        
    }
    updateCategory = async (req: express.Request,res:express.Response,next:NextFunction)=>{
        
        try{
            const id = Number(req.params.id);
            const updateCategoryDto=plainToInstance(UpdateCategoryDto,req.body);
            const errors= await validate(updateCategoryDto);
            if(errors.length > 0)
            {
                throw new ValidationException(400, "Validation Errors", errors);

            }

            const category = await this.categoryService.updateCategoryById(id,updateCategoryDto);
            res.status(201).send(createResponse(category,"OK",null,1));
            logger.info(`Updated categorywith id ${category.id}`)
        }
        catch(error)
        {
            next(error);
        }
        
        
    }
    deleteCategory = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const categoryId = Number(req.params.id);
            await this.categoryService.deleteCategoryById(categoryId);
            res.status(204).send('category deleted');
            logger.info(`Deleted Category with id ${categoryId}`);
        } catch (error) {
            next(error);
        }
    }
    


}

export default CategoryController;