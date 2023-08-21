import { IsString, ValidateIf } from "class-validator";

class SetAddressDto {
  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  address_line_1: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  address_line_2: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  city: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  state: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  country: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  pincode: string;
}

export default SetAddressDto;
