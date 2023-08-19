import { IsNotEmpty, IsNumber, IsString } from "class-validator";

class CreateAssetDto {
    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsString()
    serial_no:string;
    
    @IsNotEmpty()
    @IsNumber()
    subcategoryId:number;
}

export default CreateAssetDto;