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
    assetId: number;

  
  }
  
  export default UpdateHistoryDto;