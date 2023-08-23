import express, { NextFunction } from "express";
import RequestService from "../service/request.service";
import logger from "../utils/winston.logger";
import createResponse from "../utils/createResponse";
import { plainToInstance } from "class-transformer";
import CreateRequestDto from "../dto/create-request.dto";
import { validate } from "class-validator";
import ValidationException from "../exceptions/validation.errors";
import UpdateRequestDto from "../dto/update-request.dto";

class RequestController {
  public router: express.Router;
  constructor(private requestService: RequestService) {
    this.router = express.Router();

    this.router.get("/", this.getAllRequests);
    this.router.get("/:id", this.getRequestById);
    this.router.post("/", this.createRequest);
    this.router.put("/:id", this.updateRequest);
    this.router.delete("/:id", this.deleteRequest);
    this.router.post("/:id", this.resolveRequest);
    this.router.get("/employee/:id", this.getRequestsByEmployeeId);
  }
  getAllRequests = async (
    req: express.Request,
    res: express.Response,

    next: NextFunction
  ) => {
    try {
      const status = String(req.query.status);
      const offset = Number(req.query.offset ? req.query.offset : 0);
      const pageLength = Number(req.query.length ? req.query.length : 10);
      const [requests, total] = await this.requestService.getAllRequests(
        offset,
        pageLength,
        status
      );
      res.status(200).send(createResponse(requests, "0K", null, total));
      logger.info("Recieved All Requests");
    } catch (e) {
      next(e);
    }
  };

  getRequestById = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const requestId = Number(req.params.id);
      const requests = await this.requestService.getRequestById(requestId);
      res.status(200).send(createResponse(requests, "0K", null, 1));
      logger.info(`Recieved Request with id ${requests.id}`);
    } catch (e) {
      next(e);
    }
  };
  createRequest = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const createRequestDto = plainToInstance(CreateRequestDto, req.body);
      const errors = await validate(createRequestDto);
      if (errors.length > 0) {
        throw new ValidationException(400, "Validation Errors", errors);
      }
      const requests = await this.requestService.createRequest(
        createRequestDto
      );
      res.status(200).send(createResponse(requests, "0K", null, 1));
      logger.info(`Recieved Request with id ${requests.id}`);
    } catch (e) {
      next(e);
    }
  };
  updateRequest = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const requestId = Number(req.params.id);
      const updateRequestDto = plainToInstance(UpdateRequestDto, req.body);
      const errors = await validate(updateRequestDto);
      if (errors.length > 0) {
        throw new ValidationException(400, "Validation Errors", errors);
      }
      const requests = await this.requestService.updateRequestById(
        requestId,
        updateRequestDto
      );
      res.status(200).send(createResponse(requests, "0K", null, 1));
      logger.info(`Recieved Request with id ${requests.id}`);
    } catch (e) {
      next(e);
    }
  };

  deleteRequest = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const requestId = Number(req.params.id);
      const requests = await this.requestService.deleteRequestById(requestId);
      res.status(200).send(createResponse(requests, "0K", null, 1));
      logger.info(`Recieved Request with id ${requests.id}`);
    } catch (e) {
      next(e);
    }
  };

  resolveRequest = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const requestId = Number(req.params.id);
      const requests = await this.requestService.resolveRequestById(requestId);
      res.status(200).send(createResponse(requests, "0K", null, 1));
      logger.info(`Recieved Request with id ${requests.id}`);
    } catch (e) {
      next(e);
    }
  };

  getRequestsByEmployeeId = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id);
      const requests = await this.requestService.getRequestsByEmployeeId(
        employeeId
      );
      res.status(200).send(createResponse(requests, "0K", null, 1));
      logger.info(`Recieved Request with id ${requests}`);
    } catch (e) {
      next(e);
    }
  };
}

export default RequestController;
