import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Validate, ValidateIf, ValidateNested} from "class-validator";
import { isStringLiteral } from "typescript";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import CreateAddressDto from "./create-address.dto";
import { Column } from "typeorm";
import { Role } from "../utils/role.enum";
import { Status } from "../utils/status.enum";


class SetEmployeeDto{
    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    name:string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    username:string;

    @ValidateIf((obj) => obj.value !== undefined)
    @ValidateNested({each:true})
    @Type(()=>CreateAddressDto)
    address:Address;
    
    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    password:string
    
    @ValidateIf((obj) => obj.value !== undefined)
    @IsEnum(Role)
    role:Role;
    
    @ValidateIf((obj) => obj.value !== undefined)
    @IsNumber()
    experience:number

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    joining_date:string

    @ValidateIf((obj) => obj.value !== undefined)
    @IsEnum(Status)
    status:Status;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsNumber()
    departmentId:number;
}

export default SetEmployeeDto;