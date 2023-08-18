import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Address from "./address.entity";
import AbstractEntity from "./abstract-entity";
import { Role } from "../utils/role.enum";
import Department from "./department.entity";
import { Status } from "../utils/status.enum";
import { AssetStatus } from "../utils/assetStatus.enum";
import Employee from "./employee.entity";
import SubCategory from "./subCategory.entity";



@Entity("assets")
class Asset extends AbstractEntity{
    
    @Column()
    serial_no:string;

    @Column()
    name:string;

    @ManyToOne(()=>Employee,(employee)=>employee.asset)
    @JoinColumn()
    employee:Employee;

    @ManyToOne(()=>SubCategory,(subCategory)=>subCategory.asset)
    @JoinColumn()
    subcategory:SubCategory;

    @OneToMany(()=>Request,(request)=>request.assets)
    request:Request;

  

    @Column({default:AssetStatus.ALLOCATED})
    status:AssetStatus;

    


    
    
}

export default Asset;
