import { EmployeeAddress } from './employee-address';

export interface Employee {
  name: string;
  gender: string;
  contactInfo: {
    address: EmployeeAddress;
    email: string;
  };
  addDate: Date;
  salary: number;
  position: string;
  __v?: number;
  id: number;
}
