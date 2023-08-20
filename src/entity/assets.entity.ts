import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import AbstractEntity from "./abstract-entity";
import { AssetStatus } from "../utils/assetStatus.enum";
import Employee from "./employee.entity";
import SubCategory from "./subCategory.entity";
import Request from "./request.entity";

@Entity("assets")
class Asset extends AbstractEntity {
  @Column()
  serial_no: string;

  @Column()
  name: string;

  @ManyToOne(() => Employee, (employee) => employee.asset)
  @JoinColumn()
  employee: Employee;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.asset)
  @JoinColumn()
  subcategory: SubCategory;

  @Column({ nullable: true })
  employeeId: number;

  @Column()
  subcategoryId: number;

  @OneToMany(() => Request, (request) => request.asset)
  request: Request;

  @Column({ default: AssetStatus.UNALLOCATED })
  status: AssetStatus;
}

export default Asset;
