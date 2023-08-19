import dataSource from "../db/postgres.db";
import RequestRepository from "../repository/request.repository";
import Request from "../entity/request.entity";
import RequestService from "../service/request.service";
import RequestController from "../controller/request.controller";

const requestRepository = new RequestRepository(
  dataSource.getRepository(Request)
);
const requestService = new RequestService(requestRepository);
const requestController = new RequestController(requestService);
const requestRoute = requestController.router;

export { requestRoute, requestService };
