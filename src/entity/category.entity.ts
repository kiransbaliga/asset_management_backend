import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import AbstractEntity from "./abstract-entity";
import Asset from "./assets.entity";
import SubCategory from "./subCategory.entity";



@Entity("categories")
class Category extends AbstractEntity{
    

    @Column()
    name:string;

    @OneToMany(()=>SubCategory,(subCategory)=>subCategory.category)
    subcategory:SubCategory;

    


    
    
}

export default Category;
