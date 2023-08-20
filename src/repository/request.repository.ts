import { DataSource, Repository } from "typeorm";
import Request from "../entity/request.entity";
import RequestItem from "../entity/requestItem.entity";

class RequestRepository {
  private dataSource: DataSource;

  constructor(
    private requestRepository: Repository<Request>,
    private requestItemRepository: Repository<RequestItem>
  ) {}

  findAllRequests(
    offset: number,
    pageLength: number
  ): Promise<[Request[], number]> {
    return this.requestRepository.findAndCount({
      skip: offset * pageLength,
      take: pageLength,
      relations: ["employee", "asset", "requestItem"],
    });
  }

  findRequestById(id: number): Promise<Request> {
    return this.requestRepository.findOne({
      where: { id: id },
    });
  }
  findRequestItemById(id: number): Promise<RequestItem> {
    return this.requestItemRepository.findOne({
      where: { id: id },
    });
  }
  findAllRequestItemsByRequestId(id: number): Promise<RequestItem[]> {
    return this.requestItemRepository.find({
      where: { requestId: id },
    });
  }
  createRequest(newRequest: Request): Promise<Request> {
    return this.requestRepository.save(newRequest);
  }
  createRequestItem(newRequestItem: RequestItem): Promise<RequestItem> {
    return this.requestItemRepository.save(newRequestItem);
  }
  updateRequestById(updatedRequest: Request): Promise<Request> {
    return this.requestRepository.save(updatedRequest);
  }
  updateRequestItemById(updatedRequestItem: RequestItem): Promise<RequestItem> {
    return this.requestItemRepository.save(updatedRequestItem);
  }

  deleteRequestById(deletedRequest: Request): Promise<Request> {
    return this.requestRepository.softRemove(deletedRequest);
  }
}

export default RequestRepository;
