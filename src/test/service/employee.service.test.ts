import { DataSource } from "typeorm";
import EmployeeRepository from "../../repository/employee.repository";
import EmployeeService from "../../service/employee.service";
import Employee from "../../entity/employee.entity";
import { when } from "jest-when";
import { plainToInstance } from "class-transformer";
import CreateEmployeeDto from "../../dto/create-employee.dto";
import UpdateEmployeeDto from "../../dto/update-employee.dto";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import HttpException from "../../exceptions/http.exception";
import { Role } from "../../utils/role.enum";
import SetEmployeeDto from "../../dto/set-employee.dto";
import { Status } from "../../utils/status.enum";

describe('Employee Service Test', () => {
    let employeeService: EmployeeService;
    let employeeRepository: EmployeeRepository;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;

        employeeRepository = new EmployeeRepository(dataSource.getRepository(Employee));
        employeeService = new EmployeeService(employeeRepository);
        process.env.JWT_SECRET_KEY= "ABCDE";
    });

    describe('Test for getEmployeeById', () => {
        test('Test case success for getEmployeeById for id 1', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(1).mockResolvedValueOnce({ id: 1, name: "Name" });
            employeeRepository.findEmployeeById = mockFunction;
            const employee = await employeeService.getEmployeeById(1);
            expect(employee).toStrictEqual({ id: 1, name: "Name" });
        });

        test('Test case failure for getEmployeeById for id 2', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(2).mockResolvedValueOnce(null);
            employeeRepository.findEmployeeById = mockFunction;
            await expect(async () => { await employeeService.getEmployeeById(2) }).rejects.toThrowError(HttpException);
        });

        test('Test case success for getAllEmployees', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(0,1).mockResolvedValueOnce([[{ id: 1, name: "Name" }],1]);
            employeeRepository.findAllEmployees = mockFunction;
            const [employee,total] = await employeeService.getAllEmployees(0,1);
            expect([employee,total]).toStrictEqual([[{ id: 1, name: "Name" }],1]);
        });

        test('Test case empty result for getAllEmployees', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(0,1).mockResolvedValueOnce([[],0]);
            employeeRepository.findAllEmployees = mockFunction;
            const[employee,total] = await employeeService.getAllEmployees(0,1);
            expect([employee,total]).toStrictEqual([[],0]);
        });

        test('Test case success for createEmployee', async () => {
            const user = {
                name :"name",
                username: "name",
                password: "password",
                experience:5,
                departmentId:1,
                role:Role.HR,
                status:Status.ACTIVE,
                joining_date:"10/11/2000",
                address: {
                    address_line_1: "line 1",
                    address_line_2: "line 2",
                    city: "city",
                    state: "state",
                    country:"country",
                    pincode: "pincode"
                }
            };
    


            const mockFunction = jest.fn();
            const mockFunction2 = jest.fn();
            const createEmployeeDto = plainToInstance(CreateEmployeeDto, user)

            const sample_employee = new Employee();
            sample_employee.name=createEmployeeDto.name;
            sample_employee.username=createEmployeeDto.username;
            sample_employee.password="$2b$10$hmIuWSmpHajuKyb6Cy/8hO31VqUY3/KiJOeGfsT8lVEuUbuqt4op.";
            sample_employee.departmentId=createEmployeeDto.departmentId;
            sample_employee.address=createEmployeeDto.address;
            sample_employee.role=createEmployeeDto.role;
            sample_employee.joining_date=createEmployeeDto.joining_date;
            sample_employee.experience=createEmployeeDto.experience;
            //console.log(sample_employee);
            when(mockFunction).calledWith(sample_employee).mockResolvedValueOnce({ id: 1 ,username:"name"});
            employeeRepository.createEmployee = mockFunction;
            when(mockFunction2).calledWith("password",10).mockResolvedValueOnce("$2b$10$hmIuWSmpHajuKyb6Cy/8hO31VqUY3/KiJOeGfsT8lVEuUbuqt4op.")
            bcrypt.hash=mockFunction2;
            
            const employee = await employeeService.createEmployee(createEmployeeDto);
            expect(employee).toStrictEqual({ id: 1,username:"name"});
        });

        test('Test case failure for createEmployee', async () => {
            const mockFunction = jest.fn();
            const createEmployeeDto = plainToInstance(CreateEmployeeDto, { username: "name" });
            
            when(mockFunction).calledWith(createEmployeeDto).mockResolvedValueOnce({ username: "name" });
            employeeRepository.createEmployee = mockFunction;
            await expect(async () => await employeeService.createEmployee(createEmployeeDto)).rejects.toThrowError();
        });

        test('Test case success for updateEmployee with id = 1', async () => {
            const body = {
                username: "name",
                password:"pass"
            };

            const mockFunction_1 = jest.fn();
            when(mockFunction_1).calledWith(1).mockResolvedValueOnce({ id: 1, username: "OLD NAME" });
            employeeRepository.findEmployeeById = mockFunction_1;

            const mockFunction_2 = jest.fn();
            when(mockFunction_2).mockResolvedValue({ id: 1, username: "name" });
            employeeRepository.updateEmployeeById = mockFunction_2;
            const updatedEmployee=await employeeService.updateEmployeeById(1, plainToInstance(UpdateEmployeeDto, body))

            expect(updatedEmployee).toStrictEqual({ id: 1, username: "name" })
        });

        test('Test case success for updateEmployeeField with id = 1', async () => {
            const body = {
                username: "name",
                password:"pass"
            };

            const mockFunction_1 = jest.fn();
            when(mockFunction_1).calledWith(1).mockResolvedValueOnce({ id: 1, username: "OLD NAME" });
            employeeRepository.findEmployeeById = mockFunction_1;

            const mockFunction_2 = jest.fn();
            when(mockFunction_2).mockResolvedValue({ id: 1, username: "name" });
            employeeRepository.updateEmployeeById = mockFunction_2;
            const updatedEmployee=await employeeService.updateEmployeeFieldById(1, plainToInstance(SetEmployeeDto, body))

            expect(updatedEmployee).toStrictEqual({ id: 1, username: "name" })
        });



        test('Test case success for deleteEmployee with id = 1', async () => {
            const mockFunction_1 = jest.fn();
            when(mockFunction_1).calledWith("1").mockResolvedValueOnce({ id: 1, username: "name" });
            employeeRepository.findEmployeeById = mockFunction_1;

            const mockFunction_2 = jest.fn();
            when(mockFunction_2).mockResolvedValue({});
            employeeRepository.deleteEmployeeById = mockFunction_2;
            const deletedEmployee=await employeeService.deleteEmployeeById(1)

            expect(deletedEmployee).toStrictEqual({});
        });

     

        test('Test case success for loginEmployee', async () => {
            const mockFunction2=jest.fn()
            const employee = new Employee();
            employee.username = "username";
            employee.password = "$2b$10$hmIuWSmpHajuKyb6Cy/8hO31VqUY3/KiJOeGfsT8lVEuUbuqt4op.";
            when(mockFunction2).calledWith("password",10).mockResolvedValueOnce("$2b$10$hmIuWSmpHajuKyb6Cy/8hO31VqUY3/KiJOeGfsT8lVEuUbuqt4op.")
            bcrypt.hash=mockFunction2;
            

            const mockFunction = jest.fn();
            when(mockFunction).calledWith(employee.username).mockResolvedValueOnce(employee);
            employeeRepository.findEmployeeByUserName = mockFunction;

            const token = await employeeService.loginEmployee("username","password");
            expect(token).toBeDefined();
        });

        test('Test case failure for loginEmployee invalid username', async () => {

            const mockFunction2=jest.fn()
            const employee = new Employee();
            employee.name = "name";
            employee.username = "username";
            employee.password = "$2b$10$hmIuWSmpHajuKyb6Cy/8hO31VqUY3/KiJOeGfsT8lVEuUbuqt4op.";
            when(mockFunction2).calledWith("password",10).mockResolvedValueOnce("$2b$10$hmIuWSmpHajuKyb6Cy/8hO31VqUY3/KiJOeGfsT8lVEuUbuqt4op.")
            bcrypt.hash=mockFunction2;

            const mockFunction = jest.fn();
            when(mockFunction).calledWith(employee.username).mockResolvedValueOnce(null);
            employeeRepository.findEmployeeByUserName = mockFunction;

            await expect(async () => await employeeService.loginEmployee("name","password")).rejects.toThrowError(HttpException);
        });

        test('Test case failure for loginEmployee invalid password', async () => {
            const mockFunction2=jest.fn()
            const employee = new Employee();
            employee.username = "username";
            employee.password = "$2b$10$hmIuWSmpHajuKyb6Cy/8hO31VqUY3/KiJOeGfsT8lVEuUbuqt4op.";
            when(mockFunction2).calledWith("password",10).mockResolvedValueOnce("$2b$10$hmIuWSmpHajuKyb6Cy/8hO31VqUY3/KiJOeGfsT8lVEuUbuqt4op.")
            bcrypt.hash=mockFunction2;

            const mockFunction = jest.fn();
            when(mockFunction).calledWith(employee.username).mockResolvedValueOnce(employee);
            employeeRepository.findEmployeeByUserName = mockFunction;

            await expect(async () => await employeeService.loginEmployee("username","pass")).rejects.toThrowError(HttpException);
        });
    });
});