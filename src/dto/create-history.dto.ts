import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
  } from "class-validator";
  import { Type } from "class-transformer";
  import RequestItem from "../entity/requestItem.entity";
  import CreateRequestItemDto from "./create-request-item.dto";
  
  class CreateHistoryDto {
    @IsNotEmpty()
    @IsNumber()
    employeeId: number;
  
   
    @IsNotEmpty()
    @IsNumber()
    assetId: number;


  
  }
  
  export default CreateHistoryDto;