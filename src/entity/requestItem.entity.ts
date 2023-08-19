import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import AbstractEntity from "./abstract-entity";
import SubCategory from "./subCategory.entity";
import Request from "./request.entity";

@Entity("requestitem")
class RequestItem extends AbstractEntity {
  @Column()
  count: number;

  @ManyToOne(() => Request, (request) => request.requestItem)
  @JoinColumn()
  request: Request;

  @Column()
  requestId: number;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.requestItem)
  @JoinColumn()
  subcategory: SubCategory;

  @Column()
  subcategoryId: number;
}

export default RequestItem;
