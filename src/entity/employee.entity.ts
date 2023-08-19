import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import Address from "./address.entity";
import AbstractEntity from "./abstract-entity";
import { Role } from "../utils/role.enum";
import Department from "./department.entity";
import { Status } from "../utils/status.enum";
import Asset from "./assets.entity";
import Request from "./request.entity";

@Entity("employees")
class Employee extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  age: number;

  @OneToOne(() => Address, (address) => address.employee, { cascade: true })
  address: Address;

  @Column()
  password: string;

  @Column()
  experience: number;

  @Column()
  joining_date: string;

  @Column({ default: Status.ACTIVE })
  status: Status;

  @Column({ default: Role.DEVELOPER })
  role: Role;

  @ManyToOne(() => Department, (department) => department.employee, {
    cascade: true,
  })
  department: Department;

  @OneToMany(() => Asset, (asset) => asset.employee)
  asset: Asset;

  @OneToMany(() => Request, (request) => request.employee)
  request: Request;

  @Column()
  departmentId: number;
}

export default Employee;
