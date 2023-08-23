import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Asset from "./assets.entity";
import { RequestStatus } from "../utils/requestStatus.enum";
import Employee from "./employee.entity";
import RequestItem from "./requestItem.entity";
import SubCategory from "./subCategory.entity";

@Entity("subcatogery")
class SubCategoryEmployee extends AbstractEntity {
 

  @ManyToOne(() => Employee, (employee) => employee.request)
  @JoinColumn()
  employee: Employee;

  @Column()
  employeeId: number;

  @ManyToOne(() => Asset, (asset) => asset.request)
  @JoinColumn()
  subcategory: SubCategory;

  @Column()
  subcategoryId: number;


  @Column()
  count: number;
  

}

export default SubCategoryEmployee;
