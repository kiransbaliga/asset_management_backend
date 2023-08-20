import express, { NextFunction } from "express";
import AssetService from "../service/asset.service";

import { Express } from "express";
import { plainToInstance } from "class-transformer";
import CreateAssetDto from "../dto/create-asset.dto";
import { ValidationError, validate } from "class-validator";
import PropertyRequiredError from "../exceptions/validation.errors";
import ValidationException from "../exceptions/validation.errors";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import { Role } from "../utils/role.enum";
import SetAssetDto from "../dto/set-asset.dto";
import createResponse from "../utils/createResponse";
import logger from "../utils/winston.logger";

class AssetController {
    public router: express.Router;

    constructor(private assetService: AssetService) {
        this.router = express.Router();

        this.router.get("/", authenticate, this.getAllAssets);
        this.router.get("/employee/:id", authenticate, this.getAssetByEmployeeId);
        this.router.get("/:id", authenticate, this.getAssetById);
        this.router.post("/", this.createAsset);
        this.router.delete("/:id", authenticate, authorize([Role.Admin]), this.deleteAsset);
        this.router.patch("/:id", authenticate, authorize([Role.Admin]), this.updateAssetField);
    }

    getAllAssets = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const offset = Number(req.query.offset ? req.query.offset : 0);
            const pageLength = Number(req.query.length ? req.query.length : 10);
            const [assets, total] = await this.assetService.getAllAssets(offset, pageLength);
            res.status(200).send(createResponse(assets, "OK", null, total));
            logger.info('Received All Assets');
        } catch (error) {
            next(error);
        }
    }

    getAssetById = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const assetId = Number(req.params.id);
            const asset = await this.assetService.getAssetById(assetId);
            res.status(200).send(createResponse(asset, "OK", null, 1));
            logger.info(`Received Asset with id ${asset.id}`);
        } catch (error) {
            next(error);
        }
    }

    getAssetByEmployeeId = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const employeeId = Number(req.params.id);
            const [assets,total] = await this.assetService.getAssetByEmployeeId(employeeId);
            res.status(200).send(createResponse(assets, "OK", null, total));
            logger.info(`Received Assets`);
        } catch (error) {
            next(error);
        }
    }

    createAsset = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const createAssetDto = plainToInstance(CreateAssetDto, req.body);
            const errors = await validate(createAssetDto);
            if (errors.length > 0) {
                throw new ValidationException(400, "Validation Errors", errors);
            } else {
                const asset = await this.assetService.createAsset(createAssetDto);
                res.status(201).send(createResponse(asset, "OK", null, 1));
                logger.info(`Created Asset with id ${asset.id}`);
            }
        } catch (error) {
            next(error);
        }
    }

    updateAssetField = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const setAssetDto = plainToInstance(SetAssetDto, req.body);
            const errors = await validate(setAssetDto);
            if (errors.length > 0) {
                throw new ValidationException(400, "Validation Errors", errors);
            }
            const asset = await this.assetService.updateAssetFieldById(id, setAssetDto);
            res.status(201).send(createResponse(asset, "OK", null, 1));
            logger.info(`Updated Asset with id ${asset.id}`);
        } catch (error) {
            next(error);
        }
    }

    deleteAsset = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const assetId = Number(req.params.id);
            await this.assetService.deleteAssetById(assetId);
            res.status(204).send('Asset deleted');
            logger.info(`Deleted Asset with id ${assetId}`);
        } catch (error) {
            next(error);
        }
    }
}

export default AssetController;
