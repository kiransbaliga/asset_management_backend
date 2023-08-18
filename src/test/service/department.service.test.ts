import { DataSource } from "typeorm";
import DepartmentService from "../../service/department.service";
import Employee from "../../entity/employee.entity";
import { when } from "jest-when";
import * as dotenv from "dotenv";
import HttpException from "../../exceptions/http.exception";
import DepartmentRepository from "../../repository/department.repository";
import Department from "../../entity/department.entity";
import CreateDepartmentDto from "../../dto/create-department.dto";
import { plainToInstance } from "class-transformer";
import UpdateDepartmentDto from "../../dto/update-department.dto";
import EmployeeRepository from "../../repository/employee.repository";
import dataSource from "../../db/postgres.db";
import EmployeeService from "../../service/employee.service";


describe('Department Service Test', () => {
    let departmentService: DepartmentService;
    let departmentRepository: DepartmentRepository;
    let employeeRepository: EmployeeRepository;
    let employeeService: EmployeeService;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;

        employeeRepository = new EmployeeRepository(
            dataSource.getRepository(Employee)
        );
        employeeService= new EmployeeService(employeeRepository);
        departmentRepository = new DepartmentRepository(dataSource.getRepository(Department));
        departmentService = new DepartmentService(departmentRepository,employeeService);


               
    });

    describe('Test for getDepartmentById', () => {
        test('Test case success for getDepartmentById for id 1', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(1).mockResolvedValueOnce({ id: 1, name: "Name" });
            departmentRepository.findDepartmentById = mockFunction;
            const department = await departmentService.getDepartmentById(1);
            expect(department).toStrictEqual({ id: 1, name: "Name" });
        });

        test('Test case failure for getDepartmentById for id 2', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(2).mockResolvedValueOnce(null);
            departmentRepository.findDepartmentById = mockFunction;
            expect(async () => { await departmentService.getDepartmentById(2) }).rejects.toThrowError(HttpException);
        });

        test('Test case success for getAllDepartments', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(0,1).mockResolvedValueOnce([[{ id: 1, name: "Name" }],1]);
            departmentRepository.findAllDepartment = mockFunction;
            const [department,total] = await departmentService.getAllDepartment(0,1);
            expect([department,total]).toStrictEqual([[{ id: 1, name: "Name" }],1]);
        });

        test('Test case empty for getAllDepartments', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(0,1).mockResolvedValueOnce([[],0]);
            departmentRepository.findAllDepartment = mockFunction;
            const [department,total]= await departmentService.getAllDepartment(0,1);
            expect([department,total]).toStrictEqual([[],0]);
        });
        

       

        test('Test case success for createDepartment', async () => {
            const department_body = {
                name: "name"
            };
            const sample_department= new Department();
            const mockFunction = jest.fn();
            const createDepartmentDto = plainToInstance(CreateDepartmentDto, department_body);
            sample_department.name=createDepartmentDto.name;
            when(mockFunction).calledWith(sample_department).mockResolvedValue({ id: 1 ,name:"name"});
            departmentRepository.createDepartment = mockFunction;
            const department = await departmentService.createDepartment(createDepartmentDto);
            expect(department).toStrictEqual({ id: 1,name:"name"});
        });

        // test('Test case failure for createDepartment', async () => {
        //     const department_body = {
        //         name: "name"
        //     };
        //     const sample_department= new Department();
        //     const mockFunction = jest.fn();
        //     const createDepartmentDto = plainToInstance(CreateDepartmentDto, department_body);
        //     sample_department.name=createDepartmentDto.name;
        //     when(mockFunction).calledWith(sample_department).mockResolvedValue({ id: 1 ,name:"name"});
        //     departmentRepository.createADepartment = mockFunction;
        //     // const department = await departmentService.createDepartment(createDepartmentDto);
        //     // expect(department).toStrictEqual({ id: 1,name:"name"});
        //     expect(async () =>  await departmentService.createDepartment(createDepartmentDto) ).rejects.toThrowError();
        // });
        // test('Test case failure for createDepartment', async () => {
        //     const department_body = {
        //         name: "name"
        //     };
        //     const mockFunction = jest.fn();
        //     const createDepartmentDto = plainToInstance(CreateDepartmentDto, department_body)
        //     when(mockFunction).calledWith(createDepartmentDto).mockResolvedValueOnce({ name:"name"});
        //     departmentRepository.createADepartment = mockFunction;

        //     expect(async () =>  await departmentService.createDepartment(createDepartmentDto) ).rejects.toThrowError();
        // });

        test('Test case success for updateDepartment with id = 1', async () => {
            const body = {
                name: "name"
            };

            const mockFunction_1 = jest.fn();
            when(mockFunction_1).calledWith(1).mockResolvedValueOnce({ id: 1, name: "OLD NAME" });
            departmentRepository.findDepartmentById = mockFunction_1;

            const mockFunction_2 = jest.fn();
            when(mockFunction_2).mockResolvedValue({ id: 1, name: "name" });
            departmentRepository.updateDepartmentById = mockFunction_2;
            const updatedDepartment=await departmentService.updateDepartmentById(1, plainToInstance(UpdateDepartmentDto, body))

            expect(updatedDepartment).toStrictEqual({ id: 1, name: "name" })
        });

            test('Test case success for deleteDepartment with id = 1', async () => {
                const mockFunction1 = jest.fn();
                when(mockFunction1).calledWith(1).mockResolvedValueOnce({ id: 1, name: "name" });
                departmentRepository.findDepartmentById = mockFunction1;

                const mockFunction2 = jest.fn();
                when(mockFunction2).calledWith(1).mockResolvedValueOnce(null);
               

                employeeService.getEmployeeByDepartmentId = mockFunction2;

                const mockFunction3 = jest.fn();
                when(mockFunction3).mockResolvedValue({});
                departmentRepository.deleteDepartmentById = mockFunction3;
                const deletedDepartment=await departmentService.deleteDepartmentById(1)

                expect(deletedDepartment).toStrictEqual({});
            }); 
    });
});