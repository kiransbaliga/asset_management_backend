import { DataSource, Repository } from "typeorm";
import dataSource from "../db/postgres.db";
import Employee from "../entity/employee.entity";

class EmployeeRepository {
  private dataSource: DataSource;

  constructor(private employeeRepository: Repository<Employee>) {}

  findAllEmployees(
    offset: number,
    pageLength: number
  ): Promise<[Employee[], number]> {
    return this.employeeRepository.findAndCount({
      skip: offset * pageLength,
      take: pageLength,
      select: ["department"],
    });
  }

  findEmployeeById(id: number): Promise<Employee> {
    return this.employeeRepository.findOne({
      where: { id: id },
      relations: ["address"],
    });
  }
  findEmployeeByDepartmentId(department_id: number): Promise<Employee> {
    return this.employeeRepository.findOne({
      where: { departmentId: department_id },
      relations: ["address"],
    });
  }
  findEmployeeByUserName(username: string): Promise<Employee> {
    return this.employeeRepository.findOne({
      where: { username: username },
      relations: {
        address: true,
      },
    });
  }
  createEmployee(newEmployee: Employee): Promise<Employee> {
    return this.employeeRepository.save(newEmployee);
  }

  updateEmployeeById(updatedEmployee: Employee): Promise<Employee> {
    return this.employeeRepository.save(updatedEmployee);
  }
  deleteEmployeeById(deletedEmployee: Employee): Promise<Employee> {
    return this.employeeRepository.softRemove(deletedEmployee);
  }
}

export default EmployeeRepository;
