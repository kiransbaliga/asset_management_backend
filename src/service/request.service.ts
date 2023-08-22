import RequestRepository from "../repository/request.repository";
import Request from "../entity/request.entity";
import HttpException from "../exceptions/http.exception";
import CreateRequestDto from "../dto/create-request.dto";
import RequestItem from "../entity/requestItem.entity";
import UpdateRequestDto from "../dto/update-request.dto";
import { RequestStatus } from "../utils/requestStatus.enum";
import { AssetStatus } from "../utils/assetStatus.enum";
import AssetRepository from "../repository/asset.repository";

class RequestService {
  constructor(
    private requestRepository: RequestRepository,
    private assetRepository: AssetRepository
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
    updateRequestDto.requestItem.forEach(async (item) => {
      const requestItem = await this.requestRepository.findRequestItemById(
        item.requestId
      );
      requestItem.subcategoryId = item.subcategoryId;
      requestItem.count = item.count;
      requestItem.request = updatedRequest;
      this.requestRepository.updateRequestItemById(requestItem);
    });
    return this.requestRepository.updateRequestById(request);
  }

  async deleteRequestById(id: number): Promise<Request> {
    const request = await this.requestRepository.findRequestById(id);
    return this.requestRepository.deleteRequestById(request);
  }

  async resolveRequestById(id: number): Promise<Request> {
    try {
      const request = await this.requestRepository.findRequestById(id);
      if (request.status != RequestStatus.PENDING)
        throw new HttpException(404, "Request already Resolved/rejected");
      if (!request.assetId) {
        request.status = RequestStatus.RESOLVED;
        const requestItems =
          await this.requestRepository.findAllRequestItemsByRequestId(id);
        requestItems.forEach(async (item) => {
          const assets =
            await this.assetRepository.findAssetsBySubcategoryIdandCount(
              item.subcategoryId,
              item.count
            );
          if (assets.length <= 0)
            throw new HttpException(404, "Not enough assets to b assigned");
          assets.forEach(async (asset) => {
            asset.employeeId = request.employeeId;
            asset.status = AssetStatus.ALLOCATED;
            await this.assetRepository.updateAssetById(asset);
          });
        });
      } else {
        request.status = RequestStatus.RESOLVED;
        const current_asset = await this.assetRepository.findAssetById(
          request.assetId
        );
        console.log(current_asset);
        const [newAsset] =
          await this.assetRepository.findAssetsBySubcategoryIdandCount(
            current_asset.subcategoryId,
            1
          );
        console.log(newAsset);
        current_asset.employeeId = null;
        current_asset.status = AssetStatus.UNALLOCATED;
        newAsset.employeeId = request.employeeId;
        newAsset.status = AssetStatus.ALLOCATED;
        await this.assetRepository.updateAssetById(current_asset);
        await this.assetRepository.updateAssetById(newAsset);
      }
      return this.requestRepository.updateRequestById(request);
    } catch (e) {
      throw new HttpException(404, "Not enough assets to be assigned");
    }
  }
}

export default RequestService;
