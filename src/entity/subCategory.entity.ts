import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Address from "./address.entity";
import AbstractEntity from "./abstract-entity";
import { Role } from "../utils/role.enum";
import Department from "./department.entity";
import { Status } from "../utils/status.enum";
import { AssetStatus } from "../utils/assetStatus.enum";
import Employee from "./employee.entity";
import Asset from "./assets.entity";
import Category from "./category.entity";
import RequestItem from "./requestItem.entity";



@Entity("subcategories")
class SubCategory extends AbstractEntity{
    

    @Column()
    name:string;

    @OneToMany(()=>Asset,(asset)=>asset.subCategory)
    asset:Asset;


    @ManyToOne(()=>Category,(category)=>category.subCategory)
    @JoinColumn()
    category:Category;

    @OneToMany(()=>RequestItem,(requestitem)=>requestitem.subCategory)
    requestItem:RequestItem;


    
    
}

export default SubCategory;
