import RequestRepository from "../repository/request.repository";
import Request from "../entity/request.entity";
import HttpException from "../exceptions/http.exception";
import CreateRequestDto from "../dto/create-request.dto";
import RequestItem from "../entity/requestItem.entity";
import UpdateRequestDto from "../dto/update-request.dto";

class RequestService {
  constructor(private requestRepository: RequestRepository) {}

  getAllRequests(
    offset: number,
    pageLength: number
  ): Promise<[Request[], number]> {
    return this.requestRepository.findAllRequests(offset, pageLength);
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
      const requestItem = await this.requestRepository.findRequestItemById(item.requestId);
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
}

export default RequestService;
