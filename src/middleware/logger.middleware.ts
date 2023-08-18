import { NextFunction, Request, Response } from "express"
import logger from "../utils/winston.logger";

const loggerMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    
    logger.info(`${new Date()}:${req.url}:${req.method}`);
    next();

    // const traceId = crypto.randomUUID();
    
//     res.traceId = traceId;
//     res.startTime = new Date();
    
//     logger.log({
//         level: 'http',
//         timeStamp: new Date(),
//         traceId: res.traceId,
//         message: `${req.method}: ${req.url}`,
//     });
}

export default loggerMiddleware;