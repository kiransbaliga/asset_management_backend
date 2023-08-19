import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import AbstractEntity from "./abstract-entity";
import SubCategory from "./subCategory.entity";
import { RequestStatus } from "../utils/requestStatus.enum";
import Request from "./request.entity";




@Entity("requestitem")
class RequestItem extends AbstractEntity{
    


    @Column()
    count: number;



    @ManyToOne(()=> Request,(request)=>request.requestItem)
    @JoinColumn()
    request:Request;

    @ManyToOne(()=>SubCategory,(subCategory)=>subCategory.requestItem)
    @JoinColumn()
    subcategory:SubCategory;

    @Column()
    requestId:number;

    @Column()
    subcategoryId:number;


}

export default RequestItem;
