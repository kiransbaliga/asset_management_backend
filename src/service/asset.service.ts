import CreateAssetDto from "../dto/create-asset.dto";
import SetAssetDto from "../dto/set-asset.dto";
import Address from "../entity/address.entity";
import Asset from "../entity/assets.entity";
import HttpException from "../exceptions/http.exception";
import SubCategoryRepository from "../repository/subcategory.repository";
import AssetRepository from "../repository/asset.repository";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

class AssetService {
    
    constructor(private assetRepository: AssetRepository) {

    }

    getAllAssets(offset: number, pageLength: number): Promise<[Asset[], number]> {
        return this.assetRepository.findAllAssets(offset, pageLength);
    }

    async getAssetById(id: number): Promise<Asset | null> {
        const asset = await this.assetRepository.findAssetById(id);
        if (!asset) {
            throw new HttpException(404, `Asset not Found with id:${id}`);
        }
        return asset;
    }

    async getAssetBySubCategoryId(subcategory_id: number): Promise<[Asset[],number]> {
         
        return this.assetRepository.findAssetBySubCategoryId(subcategory_id);
    }

    async getAssetByEmployeeId(employee_id:number): Promise<[Asset[],number]> {
     
        return this.assetRepository.findAssetByEmployeeId(employee_id);;
    }

    async createAsset(createAssetDto: CreateAssetDto): Promise<Asset> {
        const asset = new Asset();
        asset.name = createAssetDto.name;
        asset.serial_no = createAssetDto.serial_no;
        asset.subcategoryId = createAssetDto.subcategoryId;
        
        const createdAsset = await this.assetRepository.createAsset(asset);
        return createdAsset;
    }

   
  

    async updateAssetFieldById(id: number, updateAssetDto: SetAssetDto): Promise<Asset> {
        const asset = await this.assetRepository.findAssetById(id);
        asset.name = updateAssetDto.name;
        asset.serial_no = updateAssetDto.serial_no;
        asset.subcategoryId = updateAssetDto.subcategoryId;
        asset.status=updateAssetDto.status;
        asset.employeeId=updateAssetDto.employeeId;
        return this.assetRepository.updateAssetById(asset);
    }

    async deleteAssetById(id: number): Promise<Asset> {
        const asset = await this.assetRepository.findAssetById(id);
        return this.assetRepository.deleteAssetById(asset);
    }
}

export default AssetService;
