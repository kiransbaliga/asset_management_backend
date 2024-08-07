import { DataSource, Repository } from "typeorm";
import dataSource from "../db/postgres.db";
import History from "../entity/history.entity";

class HistoryRepository {
    private dataSource: DataSource;

    constructor(private historyRepository: Repository<History>) {

    }

    findAllHistory(offset: number, pageLength: number): Promise<[History[], number]> {
        return this.historyRepository.findAndCount({
            skip: offset * pageLength,
            take: pageLength
        });
    }
    findAllHistoryByAssetId(asset_id: number): Promise<History[]> {
        return this.historyRepository.find({
          where: { assetId: asset_id },
          relations: ["employee"],
        });
      }

    findHistoryById(id: number): Promise<History> {
        return this.historyRepository.findOne({
            where: { id: id }
        });
    }

    async findHistoryByAssetId(asset_id: number): Promise<History> {
        const history= await this.historyRepository.find({
            where: { assetId: asset_id },
            order: { createdAt: "DESC" },
            skip:0,
            take:1,
            
        });
        return history[0];
    }

    

    createHistory(newHistory: History): Promise<History> {
        console.log('History Repository');
        return this.historyRepository.save(newHistory);
    }

    updateHistoryById(updatedHistory: History): Promise<History> {
        return this.historyRepository.save(updatedHistory);
    }

    deleteHistoryById(deletedHistory: History): Promise<History> {
        return this.historyRepository.softRemove(deletedHistory);
    }
}

export default HistoryRepository;
