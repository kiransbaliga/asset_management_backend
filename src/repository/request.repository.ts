import { DataSource, Repository } from "typeorm";
import Request from "../entity/request.entity";

class RequestRepository {
  private dataSource: DataSource;

  constructor(private requestRepository: Repository<Request>) {}

  findAllRequests(
    offset: number,
    pageLength: number
  ): Promise<[Request[], number]> {
    return this.requestRepository.findAndCount({
      skip: offset * pageLength,
      take: pageLength,
    });
  }

  findRequestById(id: number): Promise<Request> {
    return this.requestRepository.findOne({
      where: { id: id },
    });
  }
  createRequest(newRequest: Request): Promise<Request> {
    return this.requestRepository.save(newRequest);
  }

  updateRequestById(updatedRequest: Request): Promise<Request> {
    return this.requestRepository.save(updatedRequest);
  }
  deleteRequestById(deletedRequest: Request): Promise<Request> {
    return this.requestRepository.softRemove(deletedRequest);
  }
}

export default RequestRepository;