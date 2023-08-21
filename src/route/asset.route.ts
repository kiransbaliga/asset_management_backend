import AssetController from "../controller/asset.controller";
import dataSource from "../db/postgres.db";
import Category from "../entity/category.entity";
import Asset from "../entity/assets.entity";
import CategoryRepository from "../repository/category.repository";
import AssetRepository from "../repository/asset.repository";
import AssetService from "../service/asset.service";
import SubCategoryRepository from "../repository/subcategory.repository";
import SubCategory from "../entity/subCategory.entity";

const assetRepository = new AssetRepository(dataSource.getRepository(Asset));
const categoryRepository = new CategoryRepository(
  dataSource.getRepository(Category)
);
const subCategoryRepository = new SubCategoryRepository(
  dataSource.getRepository(SubCategory)
);

const assetService = new AssetService(
  assetRepository,
  categoryRepository,
  subCategoryRepository
);

const assetController = new AssetController(assetService);
const assetRoute = assetController.router;

export { assetRoute, assetService };
