import { DataSource, Repository } from "typeorm";
import dataSource from "../db/postgres.db";
import Asset from "../entity/assets.entity";
import { AssetStatus } from "../utils/assetStatus.enum";

class AssetRepository {
  private dataSource: DataSource;

  constructor(private assetRepository: Repository<Asset>) {}

  findAllAssets(
    offset: number,
    pageLength: number
  ): Promise<[Asset[], number]> {
    return this.assetRepository.findAndCount({
      skip: offset * pageLength,
      take: pageLength,
      select: ["subcategory"],
    });
  }

  findAssetById(id: number): Promise<Asset> {
    return this.assetRepository.findOne({
      where: { id: id },
    });
  }

  findAssetBySubCategoryId(subcategory_id: number): Promise<Asset> {
    return this.assetRepository.findOne({
      where: { subcategoryId: subcategory_id },
      relations: ["address"],
    });
  }

  findAssetsBySubcategoryIdandCount(subcategory_id: number, count: number) {
    //status is unallocated
    return this.assetRepository.find({
      where: { subcategoryId: subcategory_id, status: AssetStatus.UNALLOCATED },
      take: count,
    });
  }
  createAsset(newAsset: Asset): Promise<Asset> {
    return this.assetRepository.save(newAsset);
  }
  createBatchAsset(newAsset: Asset[]): Promise<Asset[]> {
    return this.assetRepository.save(newAsset);
  }

  updateAssetById(updatedAsset: Asset): Promise<Asset> {
    return this.assetRepository.save(updatedAsset);
  }

  deleteAssetById(deletedAsset: Asset): Promise<Asset> {
    return this.assetRepository.softRemove(deletedAsset);
  }
}

export default AssetRepository;
