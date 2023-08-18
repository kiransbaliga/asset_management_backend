import * as dotenv from "dotenv";
dotenv.config({path:__dirname+'/.env'});
import "reflect-metadata";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import dataSource from "./db/postgres.db";
import loggerMiddleware from "./middleware/logger.middleware";
import { employeeRoute } from "./route/employee.route";
import HttpException from "./exceptions/http.exception";
import errorMiddleware from "./middleware/error.middleware";
import rolesRoute from "./route/roles.route";
import departmentRoute from "./route/department.route";


const server=express();
server.use(cors());
server.use(express.json());
server.use(loggerMiddleware);
server.use('/employees',employeeRoute);
server.use('/roles',rolesRoute);
server.use('/department',departmentRoute);



server.get('/',(req,res) => {
    console.log(req.url);
    res.status(200).send("Hello world typescript");
});

server.use(errorMiddleware);

(async ()=>{
    await dataSource.initialize();
    server.listen(3000,()=> {
        console.log("Server is listening to 3000");
    });
    
})();

