import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";

class SetSubCategoryDto {
    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    name:string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsNumber()
    categoryId:number;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsNumber()
    count:number;


    @ValidateIf((obj) => obj.value !== undefined)
    @IsBoolean()
    perishable:boolean;
    
}

export default SetSubCategoryDto;