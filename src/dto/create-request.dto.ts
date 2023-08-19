import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import RequestItem from "../entity/requestItem.entity";
import CreateRequestItemDto from "./create-request-item.dto";

class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  employeeId: number;

  assetId: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateRequestItemDto)
  requestItem: RequestItem[];
}

export default CreateRequestDto;
