import { IsNotEmpty, IsNumber } from "class-validator";

class UpdateRequestItemDto {
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsNotEmpty()
  @IsNumber()
  subcategoryId: number;

  @IsNotEmpty()
  @IsNumber()
  requestId: number;
}

export default UpdateRequestItemDto;
