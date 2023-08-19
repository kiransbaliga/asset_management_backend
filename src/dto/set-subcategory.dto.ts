import { IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";

class SetSubCategoryDto {
    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    name:string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsNumber()
    categoryId:number;
    
}

export default SetSubCategoryDto;