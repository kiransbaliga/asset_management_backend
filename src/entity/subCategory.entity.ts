import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Asset from "./assets.entity";
import Category from "./category.entity";
import RequestItem from "./requestItem.entity";

@Entity("subcategories")
class SubCategory extends AbstractEntity {
  @Column()
  name: string;

  @OneToMany(() => Asset, (asset) => asset.subcategory)
  asset: Asset;

  @ManyToOne(() => Category, (category) => category.subcategory)
  @JoinColumn()
  category: Category;

  @OneToMany(() => RequestItem, (requestitem) => requestitem.subcategory)
  requestItem: RequestItem;
}

export default SubCategory;
