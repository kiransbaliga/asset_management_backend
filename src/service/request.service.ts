import RequestRepository from "../repository/request.repository";
import Request from "../entity/request.entity";
import HttpException from "../exceptions/http.exception";
import CreateRequestDto from "../dto/create-request.dto";
import RequestItem from "../entity/requestItem.entity";
import UpdateRequestDto from "../dto/update-request.dto";
import { RequestStatus } from "../utils/requestStatus.enum";
import { AssetStatus } from "../utils/assetStatus.enum";
import AssetRepository from "../repository/asset.repository";
import HistoryService from "./history.service";
import SubCategoryRepository from "../repository/subcategory.repository";
import SubCategoryEmployeeRepository from "../repository/subcategory.employee.repository";
import { plainToInstance } from "class-transformer";
import CreateSubCategoryEmployeeDto from "../dto/create-subcategoryemployee.dto";
import SubCategoryEmployee from "../entity/subcatogery-employee.entity";
import { Http } from "winston/lib/winston/transports";
import SubCategory from "../entity/subCategory.entity";

class RequestService {
  constructor(
    private requestRepository: RequestRepository,
    private assetRepository: AssetRepository,
    private historyService: HistoryService,
    private subcategoryRepository: SubCategoryRepository,
    private subcategoryEmployeeRepository: SubCategoryEmployeeRepository
  ) {}

  getAllRequests(
    offset: number,
    pageLength: number,
    status: string
  ): Promise<[Request[], number]> {
    const filter = {};
    if (status != "undefined") filter["status"] = status;
    return this.requestRepository.findAllRequests(offset, pageLength, filter);
  }

  getRequestById(id: number): Promise<Request> {
    const request = this.requestRepository.findRequestById(id);
    if (!request)
      throw new HttpException(404, `Request not Found with id:${id}`);

    return request;
  }

  async createRequest(createRequestDto: CreateRequestDto): Promise<Request> {
    const request = new Request();
    request.reason = createRequestDto.reason;
    request.employeeId = createRequestDto.employeeId;
    request.assetId = createRequestDto.assetId;
    const savedRequest = await this.requestRepository.createRequest(request);
    createRequestDto.requestItem.forEach((item) => {
      const requestItem = new RequestItem();
      requestItem.subcategoryId = item.subcategoryId;
      requestItem.count = item.count;
      requestItem.request = savedRequest;
      this.requestRepository.createRequestItem(requestItem);
    });
    return savedRequest;
    // const requestItemArray = [];
    // createRequestDto.requestItem.forEach((item) => {
    //   console.log(item);
    //   const requestItem = new RequestItem();
    //   requestItem.subcategoryId = item.subcategoryId;
    //   requestItem.count = item.count;
    //   requestItemArray.push(requestItem);
    // });
    // console.log(requestItemArray);
    // request.requestItem = requestItemArray;
    // return this.requestRepository.createRequest(request);
  }

  async updateRequestById(
    id: number,
    updateRequestDto: UpdateRequestDto
  ): Promise<Request> {
    const request = await this.requestRepository.findRequestById(id);
    request.assetId = updateRequestDto.assetId;
    request.reason = updateRequestDto.reason;
    request.employeeId = updateRequestDto.employeeId;
    request.status = updateRequestDto.status;
    const updatedRequest = await this.requestRepository.updateRequestById(
      request
    );
    await Promise.all(
      updateRequestDto.requestItem.map(async (item) => {
        const requestItem = await this.requestRepository.findRequestItemById(
          item.requestId
        );
        requestItem.subcategoryId = item.subcategoryId;
        requestItem.count = item.count;
        requestItem.request = updatedRequest;
        this.requestRepository.updateRequestItemById(requestItem);
      })
    );
    return this.requestRepository.updateRequestById(request);
  }

  async deleteRequestById(id: number): Promise<Request> {
    const request = await this.requestRepository.findRequestById(id);
    return this.requestRepository.deleteRequestById(request);
  }

  async handleExchange(currentRequest: Request) {
    try {
      const currentAsset = await this.assetRepository.findAssetById(
        currentRequest.assetId
      );
      const [newAsset] =
        await this.assetRepository.findAssetsBySubcategoryIdandCount(
          currentAsset.subcategoryId,
          1
        );
      currentAsset.employeeId = null;
      currentAsset.status = AssetStatus.UNALLOCATED;
      newAsset.employeeId = currentRequest.employeeId;
      newAsset.status = AssetStatus.ALLOCATED;
      await this.assetRepository.updateAssetById(currentAsset);
      await this.assetRepository.updateAssetById(newAsset);
      const history = await this.historyService.getHistoryByAssetId(
        currentAsset.id
      );
      await this.historyService.updateHistoryById(history.id, currentAsset.id);
      await this.historyService.createHistory(newAsset.id, newAsset.employeeId);
      currentRequest.status = RequestStatus.RESOLVED;
      return await this.requestRepository.updateRequestById(currentRequest);
    } catch (e) {
      throw e;
    }
  }
  async handlePerishable(
    currentRequest: Request,
    currentSubcategory: SubCategory,
    item: RequestItem
  ) {
    try {
      if (currentSubcategory.count - item.count < 0)
        throw new HttpException(
          404,
          `Not enough assets to be assigned with of subcategory id:${item.subcategoryId}`
        );
      currentSubcategory.count = currentSubcategory.count - item.count;
      await this.subcategoryRepository.updateSubcategoryById(
        currentSubcategory
      );
      const subcategoryEmployee = new SubCategoryEmployee();
      subcategoryEmployee.employeeId = currentRequest.employeeId;
      subcategoryEmployee.subcategoryId = currentSubcategory.id;
      subcategoryEmployee.count = item.count;
      await this.subcategoryEmployeeRepository.createSubcategoryEmployee(
        subcategoryEmployee
      );
    } catch (e) {
      throw e;
    }
  }

  async handleNonPerishable(
    currentRequest: Request,
    currentSubcategory: SubCategory,
    item: RequestItem
  ) {
    try {
      const assets =
        await this.assetRepository.findAssetsBySubcategoryIdandCount(
          item.subcategoryId,
          item.count
        );
      if (assets.length <= 0)
        throw new HttpException(
          404,
          `Not enough assets to be assigned with of subcategory id:${item.subcategoryId}`
        );
      await Promise.all(
        assets.map(async (asset) => {
          asset.employeeId = currentRequest.employeeId;
          asset.status = AssetStatus.ALLOCATED;
          await this.assetRepository.updateAssetById(asset);
          await this.historyService.createHistory(asset.id, asset.employeeId);
          const currentRequestItem =
            await this.requestRepository.findRequestItemById(item.id);
          currentRequestItem.isDone = true;
          await this.requestRepository.updateRequestItemById(
            currentRequestItem
          );
        })
      );
    } catch (e) {
      throw e;
    }
  }
  async handleNewRequest(currentRequest: Request) {
    const requestItems = currentRequest.requestItem;
    await Promise.all(
      requestItems.map(async (item) => {
        if (item.isDone) return;
        const currentSubcategory =
          await this.subcategoryRepository.findSubcategoryById(
            item.subcategoryId
          );
        if (currentSubcategory.perishable) {
          try {
            await this.handlePerishable(
              currentRequest,
              currentSubcategory,
              item
            );
          } catch (e) {
            throw e;
          }
        } else {
          try {
            await this.handleNonPerishable(
              currentRequest,
              currentSubcategory,
              item
            );
          } catch (e) {
            throw e;
          }
        }
      })
    );
    currentRequest.status = RequestStatus.RESOLVED;
    return await this.requestRepository.updateRequestById(currentRequest);
  }

  async resolveRequestById(id: number): Promise<Request> {
    try {
      const currentRequest = await this.requestRepository.findRequestById(id);
      if (currentRequest.status != RequestStatus.PENDING)
        throw new HttpException(404, "Request already Resolved/rejected");
      if (!currentRequest.assetId) {
        try {
          return await this.handleNewRequest(currentRequest);
        } catch (e) {
          throw e;
        }
      } else {
        try {
          return await this.handleExchange(currentRequest);
        } catch (e) {
          throw e;
        }
      }
    } catch (e) {
      throw e;
    }
  }

  // async resolveRequestById(id: number): Promise<Request> {
  //   try {
  //     const request = await this.requestRepository.findRequestById(id);
  //     if (request.status != RequestStatus.PENDING)
  //       throw new HttpException(404, "Request already Resolved/rejected");
  //     if (!request.assetId) {
  //       const requestItems = request.requestItem;
  //       requestItems.forEach(async (item) => {
  //         if (item.isDone) return;
  //         const currentSubcategory =
  //           await this.subcategoryRepository.findSubcategoryById(
  //             item.subcategoryId
  //           );
  //         try {
  //           if (currentSubcategory.perishable) {
  //             if (currentSubcategory.count - item.count < 0)
  //               throw new HttpException(
  //                 404,
  //                 `Not enough assets to be assigned with of subcategory id:${item.subcategoryId}`
  //               );
  //             currentSubcategory.count = currentSubcategory.count - item.count;

  //             await this.subcategoryRepository.updateSubcategoryById(
  //               currentSubcategory
  //             );
  //             const subcategoryEmployee = new SubCategoryEmployee();
  //             subcategoryEmployee.employeeId = request.employeeId;
  //             subcategoryEmployee.subcategoryId = currentSubcategory.id;
  //             subcategoryEmployee.count = item.count;

  //             await this.subcategoryEmployeeRepository.createSubcategoryEmployee(
  //               subcategoryEmployee
  //             );
  //           } else {
  //             request.status = RequestStatus.RESOLVED;
  //             const assets =
  //               await this.assetRepository.findAssetsBySubcategoryIdandCount(
  //                 item.subcategoryId,
  //                 item.count
  //               );
  //             if (assets.length <= 0)
  //               throw new HttpException(
  //                 404,
  //                 `Not enough assets to be assigned with of subcategory id:${item.subcategoryId}`
  //               );
  //             assets.forEach(async (asset) => {
  //               asset.employeeId = request.employeeId;
  //               asset.status = AssetStatus.ALLOCATED;
  //               await this.assetRepository.updateAssetById(asset);
  //               await this.historyService.createHistory(
  //                 asset.id,
  //                 asset.employeeId
  //               );
  //             });
  //           }
  //         } catch (e) {
  //           throw e;
  //         }
  //         const currentRequestItem =
  //           await this.requestRepository.findRequestItemById(item.id);
  //         currentRequestItem.isDone = true;
  //         await this.requestRepository.updateRequestItemById(
  //           currentRequestItem
  //         );
  //       });
  //       request.status = RequestStatus.RESOLVED;
  //     } else {
  //       request.status = RequestStatus.RESOLVED;
  //       const current_asset = await this.assetRepository.findAssetById(
  //         request.assetId
  //       );
  //       console.log(current_asset);
  //       const [newAsset] =
  //         await this.assetRepository.findAssetsBySubcategoryIdandCount(
  //           current_asset.subcategoryId,
  //           1
  //         );
  //       console.log(newAsset);
  //       current_asset.employeeId = null;
  //       current_asset.status = AssetStatus.UNALLOCATED;
  //       newAsset.employeeId = request.employeeId;
  //       newAsset.status = AssetStatus.ALLOCATED;
  //       await this.assetRepository.updateAssetById(current_asset);
  //       await this.assetRepository.updateAssetById(newAsset);
  //       const history = await this.historyService.getHistoryByAssetId(
  //         current_asset.id
  //       );
  //       await this.historyService.updateHistoryById(
  //         history.id,
  //         current_asset.id
  //       );

  //       await this.historyService.createHistory(
  //         newAsset.id,
  //         newAsset.employeeId
  //       );
  //     }
  //     return this.requestRepository.updateRequestById(request);
  //   } catch (e) {
  //     throw new HttpException(404, "Not enough assets to be assigned");
  //   }
  // }

  getRequestsByEmployeeId(employeeId: number): Promise<Request[]> {
    return this.requestRepository.findRequestsByEmployeeId(employeeId);
  }
}

export default RequestService;
