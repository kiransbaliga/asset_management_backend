import AssetController from "../controller/asset.controller";
import dataSource from "../db/postgres.db";
import Category from "../entity/category.entity";
import Asset from "../entity/assets.entity";
import CategoryRepository from "../repository/category.repository";
import AssetRepository from "../repository/asset.repository";
import AssetService from "../service/asset.service";
import SubCategoryRepository from "../repository/subcategory.repository";
import SubCategory from "../entity/subCategory.entity";
import EmployeeRepository from "../repository/employee.repository";
import Employee from "../entity/employee.entity";
import HistoryService from "../service/history.service";
import HistoryRepository from "../repository/history.repository";
import History from "../entity/history.entity";
import HistoryController from "../controller/history.controller";

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
  assetRepository,
);

const historyController = new HistoryController(historyService);
const historyRoute = historyController.router;

export { historyRoute, historyService };