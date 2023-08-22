import { IsNotEmpty, IsNumber, IsString } from "class-validator";

class CreateSubCategoryDto {
    @IsNotEmpty()
    @IsString()
    name:string;
    
    @IsNotEmpty()
    @IsNumber()
    categoryId:number;

  

    count:number;

     
    perishable:boolean;


}

export default CreateSubCategoryDto;