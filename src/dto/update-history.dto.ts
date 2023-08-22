import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateIf,
    ValidateNested,
  } from "class-validator";
  import { Type } from "class-transformer";
  import RequestItem from "../entity/requestItem.entity";
  import CreateRequestItemDto from "./create-request-item.dto";
  
  class UpdateHistoryDto {
    @ValidateIf((obj) => obj.value !== undefined)
    @IsNumber()
    employeeId: number;
  
   
    @ValidateIf((obj) => obj.value !== undefined)
    @IsNumber()
    assetId: number;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsNumber()
    startDate: number;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsNumber()
    endDate: number;
  
  }
  
  export default UpdateHistoryDto;