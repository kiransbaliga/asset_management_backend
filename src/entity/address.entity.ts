import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Employee from "./employee.entity";
import AbstractEntity from "./abstract-entity";

@Entity()
class Address extends AbstractEntity {
  @Column()
  address_line_1: string;

  @Column()
  address_line_2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  pincode: string;

  @OneToOne(() => Employee, (employee) => employee.address)
  @JoinColumn()
  employee: Employee;
}

export default Address;
