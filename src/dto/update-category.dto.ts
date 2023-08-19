import { IsNotEmpty, IsString } from "class-validator";

class UpdateCategoryDto {
    @IsNotEmpty()
    @IsString()
    name:string;
    
}

export default UpdateCategoryDto;