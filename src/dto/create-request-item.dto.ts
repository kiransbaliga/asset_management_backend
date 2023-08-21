import { IsNotEmpty, IsNumber } from "class-validator";

class CreateRequestItemDto {
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsNotEmpty()
  @IsNumber()
  subcategoryId: number;
}

export default CreateRequestItemDto;
