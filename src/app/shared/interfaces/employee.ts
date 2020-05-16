import { EmployeeAddress } from './employee-address';

export interface Employee {
  name: string;
  email: string;
  phone: string[];
  age: number;
  photo: File[];
  resume: string;
  // gender: string;
  // contactInfo: {
  //   address: EmployeeAddress;
  //   email: string;
  // };
  addDate?: Date;
  // salary: number;
  // position: string;
  id?: number;
}
