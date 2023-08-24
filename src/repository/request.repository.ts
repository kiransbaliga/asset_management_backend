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
    pageLength: number,
    filter: Object
  ): Promise<[Request[], number]> {
    return this.requestRepository.findAndCount({
      where: filter,
      skip: offset * pageLength,
      take: pageLength,
      relations: ["employee", "asset", "requestItem"],
    });
  }

  findRequestById(id: number): Promise<Request> {
    return this.requestRepository.findOne({
      where: { id: id },
      relations: [
        "employee",
        "asset",
        "requestItem",
        "requestItem.subcategory",
        "asset.subcategory",
      ],
    });
  }
  findRequestItemById(id: number): Promise<RequestItem> {
    return this.requestItemRepository.findOne({
      where: { id: id },
      relations: {
        request: true,
        subcategory: true,
      },
    });
  }
  findAllRequestItemsByRequestId(id: number): Promise<RequestItem[]> {
    return this.requestItemRepository.find({
      where: { requestId: id },
      relations: ["employee", "asset", "requestItem"],
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

  findRequestsByEmployeeId(id: number): Promise<Request[]> {
    return this.requestRepository.find({
      where: { employeeId: id },
      relations: ["employee", "asset", "requestItem"],
    });
  }
}

export default RequestRepository;
