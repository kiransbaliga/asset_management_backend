import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Asset from "./assets.entity";
import { RequestStatus } from "../utils/requestStatus.enum";
import Employee from "./employee.entity";
import RequestItem from "./requestItem.entity";

@Entity("request")
class Request extends AbstractEntity {
  @Column({ default: RequestStatus.PENDING })
  status: RequestStatus;

  @Column()
  reason: string;

  @ManyToOne(() => Employee, (employee) => employee.request)
  @JoinColumn()
  employee: Employee;

  @Column()
  employeeId: number;

  @ManyToOne(() => Asset, (asset) => asset.request)
  @JoinColumn()
  asset: Asset;

  @Column({ nullable: true })
  assetId: number;

  @OneToMany(() => RequestItem, (requestItem) => requestItem.request)
  requestItem: RequestItem[];
}

export default Request;
