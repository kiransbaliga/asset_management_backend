import CreateEmployeeDto from "../dto/create-employee.dto";
import SetEmployeeDto from "../dto/set-employee.dto";
import UpdateEmployeeDto from "../dto/update-employee.dto";
import Address from "../entity/address.entity";
import Employee from "../entity/employee.entity";
import HttpException from "../exceptions/http.exception";
import EmployeeRepository from "../repository/employee.repository";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  getAllEmployees(
    offset: number,
    pageLength: number
  ): Promise<[Employee[], number]> {
    return this.employeeRepository.findAllEmployees(offset, pageLength);
  }

  async getEmployeeById(id: number): Promise<Employee | null> {
    const employee = await this.employeeRepository.findEmployeeById(id);
    if (!employee) {
      throw new HttpException(404, `Employee not Found with id:${id}`);
    }
    return employee;
  }

  async getEmployeeByDepartmentId(
    department_id: number
  ): Promise<Employee | null> {
    const employee = await this.employeeRepository.findEmployeeByDepartmentId(
      department_id
    );
    return employee;
  }
  async createEmployee(
    createEmployeeDto: CreateEmployeeDto
  ): Promise<Employee> {
    const employee = new Employee();
    employee.name = createEmployeeDto.name;
    employee.username = createEmployeeDto.username;
    employee.role = createEmployeeDto.role;
    employee.experience = createEmployeeDto.experience;
    employee.joining_date = createEmployeeDto.joining_date;
    employee.status = createEmployeeDto.status;
    employee.departmentId = createEmployeeDto.departmentId;

    //to check for  exisintg dept
    employee.password = await bcrypt.hash(createEmployeeDto.password, 10);
    const newAddress = new Address();
    newAddress.address_line_1 = createEmployeeDto.address.address_line_1;
    newAddress.address_line_2 = createEmployeeDto.address.address_line_2;
    newAddress.city = createEmployeeDto.address.city;
    newAddress.state = createEmployeeDto.address.state;
    newAddress.country = createEmployeeDto.address.country;
    newAddress.pincode = createEmployeeDto.address.pincode;
    employee.address = newAddress;
    const createdEmployee = await this.employeeRepository.createEmployee(
      employee
    );
    //console.log(employee);
    return createdEmployee;
  }
  async updateEmployeeById(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto
  ): Promise<Employee> {
    console.log(updateEmployeeDto.address);
    const employee = await this.employeeRepository.findEmployeeById(id);
    employee.name = updateEmployeeDto.name;
    employee.username = updateEmployeeDto.username;
    employee.departmentId = updateEmployeeDto.departmentId;
    employee.experience = updateEmployeeDto.experience;
    employee.joining_date = updateEmployeeDto.joining_date;
    employee.status = updateEmployeeDto.status;
    employee.role = updateEmployeeDto.role;
    if (employee.address && updateEmployeeDto.address) {
      employee.address.address_line_1 =
        updateEmployeeDto.address.address_line_1;
      employee.address.address_line_2 =
        updateEmployeeDto.address.address_line_2;
      employee.address.city = updateEmployeeDto.address.city;
      employee.address.state = updateEmployeeDto.address.state;
      employee.address.country = updateEmployeeDto.address.country;
      employee.address.pincode = updateEmployeeDto.address.pincode;
    }

    const emp = this.employeeRepository.updateEmployeeById(employee);
    return emp;
  }
  async updateEmployeeFieldById(
    id: number,
    updateEmployeeDto: SetEmployeeDto
  ): Promise<Employee> {
    console.log(updateEmployeeDto.address);
    const employee = await this.employeeRepository.findEmployeeById(id);
    employee.name = updateEmployeeDto.name;
    employee.username = updateEmployeeDto.username;
    employee.departmentId = updateEmployeeDto.departmentId;
    employee.experience = updateEmployeeDto.experience;
    employee.joining_date = updateEmployeeDto.joining_date;
    employee.status = updateEmployeeDto.status;
    employee.role = updateEmployeeDto.role;
    if (employee.address && updateEmployeeDto.address) {
      employee.address.address_line_1 =
        updateEmployeeDto.address.address_line_1;
      employee.address.address_line_2 =
        updateEmployeeDto.address.address_line_2;
      employee.address.city = updateEmployeeDto.address.city;
      employee.address.state = updateEmployeeDto.address.state;
      employee.address.country = updateEmployeeDto.address.country;
      employee.address.pincode = updateEmployeeDto.address.pincode;
    }

    return this.employeeRepository.updateEmployeeById(employee);
  }
  async deleteEmployeeById(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findEmployeeById(id);
    return this.employeeRepository.deleteEmployeeById(employee);
  }

  loginEmployee = async (username: string, password: string) => {
    const employee = await this.employeeRepository.findEmployeeByUserName(
      username
    );
    if (!employee) {
      throw new HttpException(401, "Incorrect username or Password");
    }

    const result = await bcrypt.compare(password, employee.password);
    if (!result) {
      throw new HttpException(401, "Incorrect username or Password");
    }

    const payload = {
      name: employee.name,
      username: employee.username,
      role: employee.role,
    };
    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    return { token: token };
  };
}

export default EmployeeService;
