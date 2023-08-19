import { DataSource, Repository } from "typeorm";
import dataSource from "../db/postgres.db";
import Asset from "../entity/assets.entity";

class AssetRepository {
    private dataSource: DataSource;

    constructor(private assetRepository: Repository<Asset>) {

    }

    findAllAssets(offset: number, pageLength: number): Promise<[Asset[], number]> {
        return this.assetRepository.findAndCount({
            skip: offset * pageLength,
            take: pageLength,
            select: ["subcategory"]
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
            relations: ["address"]
        });
    }



    createAsset(newAsset: Asset): Promise<Asset> {
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
