import CreateHistoryDto from "../dto/create-history.dto";
import UpdateHistoryDto from "../dto/update-history.dto";
import History from "../entity/history.entity";
import HttpException from "../exceptions/http.exception";
import AssetRepository from "../repository/asset.repository";
import EmployeeRepository from "../repository/employee.repository";
import HistoryRepository from "../repository/history.repository";
import EmployeeService from "./employee.service";

class HistoryService {
  constructor(
    private historyRepository: HistoryRepository,
    private employeeRepository: EmployeeRepository,
    private assetRepository: AssetRepository
  ) {}

  getAllHistory(
    offset: number,
    pageLength: number
  ): Promise<[History[], number]> {
    return this.historyRepository.findAllHistory(offset, pageLength);
  }

  async getHistoryByAssetId(assetId: number): Promise<History | null> {
    const history = await this.historyRepository.findHistoryByAssetId(assetId);
    if (!history) {
      throw new HttpException(404, `History not found with id:${assetId}`);
    }
    return history;
  }
  async getAllHistoryByAssetId(assetId: number): Promise<History[] | null> {
    try {
      return await this.historyRepository.findAllHistoryByAssetId(assetId);
    } catch (e) {
      throw new HttpException(404, `History not found with id:${assetId}`);
    }
  }

  async getHistoryById(id: number): Promise<History | null> {
    const history = await this.historyRepository.findHistoryById(id);
    if (!history) {
      throw new HttpException(404, `History not found with id:${id}`);
    }
    return history;
  }


  async createHistory(
    assetId:number,employeeId:number
  ): Promise<History> {
    const history = new History();
    // Assuming properties like 'name' exist in CreateHistoryDto
    history.employeeId = employeeId;
    history.assetId = assetId;
  
    return this.historyRepository.createHistory(history);
  }

  async updateHistoryById(
    id: number,
    assetId:number
  ): Promise<History> {
    const history = await this.historyRepository.findHistoryById(id);
    
    // history.employeeId = employeeId;
    history.assetId = assetId;
    history.flag=history.flag+1;
    console.log(history.id)
    return this.historyRepository.updateHistoryById(history);
  }

  async deleteHistoryById(id: number): Promise<History> {
    const history = await this.historyRepository.findHistoryById(id);

    return this.historyRepository.deleteHistoryById(history);
  }
}

export default HistoryService;
