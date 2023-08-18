import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Asset from "./assets.entity";
import SubCategory from "./subCategory.entity";
import { RequestStatus } from "../utils/requestStatus.enum";
import Employee from "./employee.entity";
import RequestItem from "./requestItem.entity";



@Entity("request")
class Request extends AbstractEntity{
    

    @Column({default:RequestStatus.PENDING})
    status:RequestStatus;

    @Column()
    reason: string;



    @ManyToOne(()=>Employee,(employee)=>employee.request)
    @JoinColumn()
    employee:Employee;

    @ManyToOne(()=>Asset,(asset)=>asset.request)
    @JoinColumn()
    asset:Asset;


    @OneToMany(()=>RequestItem,(requestItem)=>requestItem.request)
    requestItem:RequestItem;

    


    
    
}

export default Request;
