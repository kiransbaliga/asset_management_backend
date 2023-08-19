import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";
import { AssetStatus } from "../utils/assetStatus.enum";

class SetAssetDto {
    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    name:string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsNumber()
    serial_no:string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsEnum(AssetStatus)
    status:AssetStatus;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsNumber()
    employeeId:number;
    


    @ValidateIf((obj) => obj.value !== undefined)
    @IsNumber()
    subcategoryId:number;
    
}

export default SetAssetDto;