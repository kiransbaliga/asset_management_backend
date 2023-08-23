import dataSource from "../db/postgres.db";
import RequestRepository from "../repository/request.repository";
import Request from "../entity/request.entity";
import RequestService from "../service/request.service";
import RequestController from "../controller/request.controller";
import RequestItem from "../entity/requestItem.entity";
import AssetRepository from "../repository/asset.repository";
import Asset from "../entity/assets.entity";
import HistoryController from "../controller/history.controller";
import EmployeeRepository from "../repository/employee.repository";
import HistoryRepository from "../repository/history.repository";
import HistoryService from "../service/history.service";
import Employee from "../entity/employee.entity";
import History from "../entity/history.entity";
import SubCategory from "../entity/subCategory.entity";
import SubCategoryRepository from "../repository/subcategory.repository";

const requestRepository = new RequestRepository(
  dataSource.getRepository(Request),
  dataSource.getRepository(RequestItem)
);

const assetRepository = new AssetRepository(dataSource.getRepository(Asset));

const employeeRepository = new EmployeeRepository(
  dataSource.getRepository(Employee)
);

const historyRepository = new HistoryRepository(
  dataSource.getRepository(History)
);

const historyService = new HistoryService(
  historyRepository,
  employeeRepository,
  assetRepository
);

const subcategoryRepository = new SubCategoryRepository(
  dataSource.getRepository(SubCategory)
);

const requestService = new RequestService(
  requestRepository,
  assetRepository,
  historyService,
  subcategoryRepository
);
const requestController = new RequestController(requestService);
const requestRoute = requestController.router;

export { requestRoute, requestService };
