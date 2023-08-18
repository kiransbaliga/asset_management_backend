import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Validate, ValidateNested} from "class-validator";
import { isStringLiteral } from "typescript";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import CreateAddressDto from "./create-address.dto";
import { Column } from "typeorm";
import { Role } from "../utils/role.enum";
import { Status } from "../utils/status.enum";


class UpdateEmployeeDto{
    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsString()
    username:string;

    @IsNotEmpty()
    @ValidateNested({each:true})
    @Type(()=>CreateAddressDto)
    address:Address;

    @IsNotEmpty()
    @IsString()
    password:string

    @IsNotEmpty()
    @IsEnum(Role)
    role:Role;

    @IsNotEmpty()
    @IsNumber()
    experience:number

    @IsNotEmpty()
    @IsString()
    joining_date:string

    @IsNotEmpty()
    @IsEnum(Status)
    status:Status

    @IsNotEmpty()
    @IsNumber()
    departmentId:number;
}

export default UpdateEmployeeDto;