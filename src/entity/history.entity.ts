import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Asset from "./assets.entity";
import { RequestStatus } from "../utils/requestStatus.enum";
import Employee from "./employee.entity";
import RequestItem from "./requestItem.entity";

@Entity("history")
class History extends AbstractEntity {
 

  @ManyToOne(() => Employee, (employee) => employee.request)
  @JoinColumn()
  employee: Employee;

  @Column()
  employeeId: number;

  @ManyToOne(() => Asset, (asset) => asset.request)
  @JoinColumn()
  asset: Asset;

  @Column()
  assetId: number;

  @Column()
  startDate: number;

  @Column({ nullable: true })
  endDate: number;

  

}

export default History;
