import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Asset from "./assets.entity";
import { RequestStatus } from "../utils/requestStatus.enum";
import Employee from "./employee.entity";
import RequestItem from "./requestItem.entity";
import SubCategory from "./subCategory.entity";

@Entity("subcatogeryEmployee")
class SubCategoryEmployee extends AbstractEntity {
 

  @ManyToOne(() => Employee, (employee) => employee.subcategoryEmployee)
  @JoinColumn()
  employee: Employee;

  @Column()
  employeeId: number;

  @ManyToOne(() => SubCategory, (subcategory) => subcategory.subcategoryEmployee)
  @JoinColumn()
  subcategory: SubCategory;

  @Column()
  subcategoryId: number;


  @Column()
  count: number;
  

}

export default SubCategoryEmployee;
