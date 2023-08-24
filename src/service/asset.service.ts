import CreateAssetDto from "../dto/create-asset.dto";
import SetAssetDto from "../dto/set-asset.dto";
import Address from "../entity/address.entity";
import Asset from "../entity/assets.entity";
import HttpException from "../exceptions/http.exception";
import SubCategoryRepository from "../repository/subcategory.repository";
import AssetRepository from "../repository/asset.repository";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import CategoryRepository from "../repository/category.repository";
import { In } from "typeorm";
import { AssetStatus } from "../utils/assetStatus.enum";
import HistoryRepository from "../repository/history.repository";
class AssetService {
  constructor(
    private assetRepository: AssetRepository,
    private categoryRepository: CategoryRepository,
    private subCategoryRepository: SubCategoryRepository,
    private hisoryRepository: HistoryRepository
  ) {}

  async getAllAssets(
    offset: number,
    pageLength: number,
    subcategory: number,
    status: string,
    category: number
  ): Promise<[Asset[], number]> {
    const filter = {};
    if (subcategory) filter["subcategoryId"] = subcategory;
    if (status != "undefined") filter["status"] = status;
    // if category is not undefined then we need to fetch all subcategories of that category and fetch all the assets of those subcategories
    if (category && !subcategory) {
      const subcategoryFilter = {};
      // subcategoryFilter["categoryId"] = category;
      await this.subCategoryRepository
        .findSubcategoryByCategoryId(category)
        .then(async ([subcategories, count]) => {
          const subcategoryIds = subcategories.map((subcategory) => {
            return Number(subcategory.id);
          });
          filter["subcategoryId"] = In(subcategoryIds);
          return await this.assetRepository.findAllAssets(
            offset,
            pageLength,
            filter
          );
        });
    }
    return this.assetRepository.findAllAssets(offset, pageLength, filter);
  }

  async getAssetById(id: number): Promise<Asset | null> {
    const asset = await this.assetRepository.findAssetById(id);
    if (!asset) {
      throw new HttpException(404, `Asset not Found with id:${id}`);
    }
    return asset;
  }

  // async getAssetByDepartmentId(subcategory_id: number): Promise<Asset | null> {
  //   const asset = await this.assetRepository.findAssetBySubCategoryId(
  //     subcategory_id
  //   );
  //   return asset;
  // }

  async getAssetBySubCategoryId(
    subcategory_id: number
  ): Promise<[Asset[], number]> {
    return this.assetRepository.findAssetBySubCategoryId(subcategory_id);
  }

  async getAssetByEmployeeId(employee_id: number): Promise<[Asset[], number]> {
    return this.assetRepository.findAssetByEmployeeId(employee_id);
  }
  async createAsset(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = new Asset();
    asset.name = createAssetDto.name;
    asset.serial_no = createAssetDto.serial_no;
    asset.subcategoryId = createAssetDto.subcategoryId;

    const createdAsset = await this.assetRepository.createAsset(asset);
    return createdAsset;
  }
  async createBatchAsset(assetDto: CreateAssetDto[]): Promise<Asset[]> {
    
    try{
      const assetArray = [];
      await Promise.all(
        assetDto.map((item) => {
          const asset = new Asset();
          asset.name = item.name;
          asset.serial_no = item.serial_no;
          asset.subcategoryId = item.subcategoryId;
          console.log(asset);
          assetArray.push(asset);
        }))
        return await this.assetRepository.createBatchAsset(assetArray);
    }catch(e)
    {
      throw new HttpException(400,'Foriegn Key Violated')
    }
    
    
   
  }

  async updateAssetFieldById(
    id: number,
    updateAssetDto: SetAssetDto
  ): Promise<Asset> {
    const asset = await this.assetRepository.findAssetById(id);
    asset.name = updateAssetDto.name;
    asset.serial_no = updateAssetDto.serial_no;
    asset.subcategoryId = updateAssetDto.subcategoryId;
    asset.status = updateAssetDto.status;
    if (asset.employeeId && updateAssetDto.status == AssetStatus.UNALLOCATED) {
      const history = await this.hisoryRepository.findHistoryByAssetId(
        asset.id
      );
      console.log(history.id);
      history.flag += 1;
      await this.hisoryRepository.updateHistoryById(history);
      asset.employeeId = null;
      asset.employee = null;
    }

    return this.assetRepository.updateAssetById(asset);
  }

  async deleteAssetById(id: number): Promise<Asset> {
    const asset = await this.assetRepository.findAssetById(id);
    return this.assetRepository.deleteAssetById(asset);
  }
}

export default AssetService;
