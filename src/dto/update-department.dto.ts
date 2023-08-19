import { IsNotEmpty, IsString } from "class-validator";

class UpdateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export default UpdateDepartmentDto;
