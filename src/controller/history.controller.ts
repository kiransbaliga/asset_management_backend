import express, { NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import ValidationException from "../exceptions/validation.errors";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import HistoryService from "../service/history.service"; // Import the HistoryService
import CreateHistoryDto from "../dto/create-history.dto"; // Import the CreateHistoryDto
import UpdateHistoryDto from "../dto/update-history.dto"; // Import the UpdateHistoryDto
import logger from "../utils/winston.logger";
import { Role } from "../utils/role.enum";
import createResponse from "../utils/createResponse";

class HistoryController {
  public router: express.Router;

  constructor(private historyService: HistoryService) { // Use HistoryService
    this.router = express.Router();
    this.router.get("/", this.getAllHistory); // Update route handler references
    this.router.get("/:id", this.getHistoryById); // Update route handler references
    this.router.post(
      "/",
      // authenticate,
      // authorize([Role.HR, Role.Admin]),
      this.createHistory // Update route handler references
    );
    this.router.patch(
      "/:id",
      // authenticate,
      // authorize([Role.HR, Role.Admin]),
      this.updateHistory // Update route handler references
    );
    this.router.delete(
      "/:id",
      // authenticate,
      // authorize([Role.HR, Role.Admin]),
      this.deleteHistory // Update route handler references
    );
  }

  // Update route handlers to use historyService instead of departmentService
  getAllHistory = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const offset = Number(req.query.offset ? req.query.offset : 0);
      const pageLength = Number(req.query.length ? req.query.length : 10);
      const [historyItems, total] =
        await this.historyService.getAllHistory(offset, pageLength);
      res.status(200).send(createResponse(historyItems, "OK", null, total));
      logger.info("Received all history items");
    } catch (error) {
      next(error);
    }
  };
  getHistoryById = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const historyId = Number(req.params.id);
      const historyItem = await this.historyService.getHistoryById(historyId);
      res.status(200).send(createResponse(historyItem, "OK", null, 1));
      logger.info(`Received History item with id ${historyId}`);
    } catch (error) {
      next(error);
    }
  };
  createHistory = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const createHistoryDto = plainToInstance(
        CreateHistoryDto,
        req.body
      );
      const errors = await validate(createHistoryDto);
      if (errors.length > 0) {
        throw new ValidationException(400, "Validation Errors", errors);
      } else {
        const historyItem = await this.historyService.createHistory(
          createHistoryDto.assetId,createHistoryDto.employeeId
        );

        res.status(201).send(createResponse(historyItem, "OK", null, 1));
        logger.info(`Created History item with id ${historyItem.id}`);
      }
    } catch (error) {
      next(error);
    }
  };
  updateHistory = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const updateHistoryDto = plainToInstance(
        UpdateHistoryDto,
        req.body
      );
      const errors = await validate(updateHistoryDto);
      if (errors.length > 0) {
        throw new ValidationException(400, "Validation Errors", errors);
      }

      const historyItem = await this.historyService.updateHistoryById(
        id,
        updateHistoryDto.assetId
      );
      res.status(201).send(createResponse(historyItem, "OK", null, 1));
      logger.info(`Updated History item with id ${historyItem.id}`);
    } catch (error) {
      next(error);
    }
  };

  deleteHistory = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const historyId = Number(req.params.id);
      await this.historyService.deleteHistoryById(historyId);
      res.status(204).send("History item deleted");
      logger.info(`Deleted History item with id ${historyId}`);
    } catch (error) {
      next(error);
    }
  };

  // Similar updates for other route handlers...

}

export default HistoryController; // Export the HistoryController
