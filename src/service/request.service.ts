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

  createRequest(createRequestDto: CreateRequestDto): Promise<Request> {
    const request = new Request();
    request.reason = createRequestDto.reason;

    request.employeeId = createRequestDto.employeeId;
    request.assetId = createRequestDto.assetId;
    const requestItemArray = [];
    createRequestDto.requestItem.forEach((item) => {
      const requestItem = new RequestItem();
      requestItem.subcategoryId = item.subcategoryId;
      requestItem.count = item.count;
      requestItemArray.push(requestItem);
    });
    request.requestItem = requestItemArray;
    return this.requestRepository.createRequest(request);
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
    const requestItemArray = [];
    updateRequestDto.requestItem.forEach((item) => {
      const requestItem = new RequestItem();
      requestItem.subcategoryId = item.subcategoryId;
      requestItem.count = item.count;
      requestItemArray.push(requestItem);
    });
    request.requestItem = requestItemArray;
    return this.requestRepository.updateRequestById(request);
  }

  async deleteRequestById(id: number): Promise<Request> {
    const request = await this.requestRepository.findRequestById(id);
    return this.requestRepository.deleteRequestById(request);
  }
}

export default RequestService;
