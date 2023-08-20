import dataSource from "../db/postgres.db";
import RequestRepository from "../repository/request.repository";
import Request from "../entity/request.entity";
import RequestService from "../service/request.service";
import RequestController from "../controller/request.controller";
import RequestItem from "../entity/requestItem.entity";
import AssetRepository from "../repository/asset.repository";
import Asset from "../entity/assets.entity";

const requestRepository = new RequestRepository(
  dataSource.getRepository(Request),
  dataSource.getRepository(RequestItem)
);
const assetRepository = new AssetRepository(dataSource.getRepository(Asset));
const requestService = new RequestService(requestRepository, assetRepository);
const requestController = new RequestController(requestService);
const requestRoute = requestController.router;

export { requestRoute, requestService };
