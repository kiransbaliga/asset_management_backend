import express, { NextFunction } from "express";
import EmployeeService from "../service/employee.service";

import { Express } from "express";
import { plainToInstance } from "class-transformer";
import CreateEmployeeDto from "../dto/create-employee.dto";
import { ValidationError, validate } from "class-validator";
import PropertyRequiredError from "../exceptions/validation.errors";
import ValidationException from "../exceptions/validation.errors";
import UpdateEmployeeDto from "../dto/update-employee.dto";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import { Role } from "../utils/role.enum";
import createResponse from "../utils/createResponse";
class RolesController{
    public router : express.Router;

    constructor()
    {
        this.router = express.Router();

        this.router.get("/",authenticate,authorize([Role.HR,Role.Admin]),this.getAllRoles);
    }
    getAllRoles = async (req: express.Request,res:express.Response,next:NextFunction)=> {
        try{
            const roles=Role;
            const data=Object.values(roles);
            const rolesObj={
                "data":data
            }

            res.status(200).send(createResponse(rolesObj,"OK",null,data.length));
        }
        catch(error)
        {
            next(error);
        }
        
    }
  
  



}

export default RolesController;