import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import RequestItem from "../entity/requestItem.entity";
import UpdateRequestItemDto from "./update-request-item.dto";
import { RequestStatus } from "../utils/requestStatus.enum";

class UpdateRequestDto {
  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  employeeId: number;


  assetId: number;

  @IsNotEmpty()
  @IsString()
  status: RequestStatus;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateRequestItemDto)
  requestItem: RequestItem[];
}

export default UpdateRequestDto;
