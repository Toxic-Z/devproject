import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { Employee } from '../interfaces/employee';
import { CommonService } from './common.service';
import { environment } from '../../../environments/environment';
import {NgxIndexedDBService} from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  // private url = environment.apiUrl + 'employees/'; -- for real http
  private employees: Employee[] = [];
  private mockedEmployees: Subject<Employee[]> = new Subject();
  constructor(
    // private httpClient: HttpClient, -- for real http
    private commonService: CommonService,
    private dbService: NgxIndexedDBService
  ) {
    // this.mockedEmployees.next([]);
  }

  public fetchEmployees(): void {
    this.dbService.add('people', { name: 'name', email: 'email', id: Math.random() }).then(
      employees => {
        console.log(employees);
        return employees;
      },
      error => {
        console.log(error);
      }
    );
    this.dbService.getAll('people').then(
      people => {
        console.log(people);
        return people;
      },
      error => {
        console.log(error);
      }
    );
    console.log('5555555555');
    // return this.mockedEmployees.asObservable();
    // return this.httpClient.get<Employee[]>(this.url); --for real http
  }

  public updateEmployee(employee: Employee): void {
    this.commonService.changeLoaderVisibility(true);
    // console.log(this.employees);
    // console.log(this.employees.findIndex((e: Employee) => e.id === employee.id));
    // const index = this.employees.findIndex((e: Employee) => e.id === employee.id);
    // this.employees[index] = employee;
    // this.employees = [...this.employees];
    // this.mockedEmployees.next(this.employees);
    this.dbService.update('employees', employee).then(
      res => {
        console.log(res);
        // return this.httpClient.put<boolean>(this.url + employee._id, employee); --for real http
        return of(true);
      },
      error => {
        console.log(error);
      }
    );
  }

  public createEmployee(employee: Employee): Observable<boolean> {
    console.log(employee);
    this.employees.push(employee);
    this.employees = [...this.employees];
    this.mockedEmployees.next(this.employees);
    console.log(this.employees);
    return of(true);
    // return this.httpClient.post<boolean>(this.url, employee); --for real http
  }

  public deleteEmployee(id: number): Observable<boolean> {
    this.commonService.changeLoaderVisibility(true);
    const index = this.employees.findIndex((e: Employee) => e.id === id);
    this.employees.splice(index, 1);
    this.mockedEmployees.next(this.employees);
    return of(true);
    // return this.httpClient.delete<boolean>(this.url + id); --for real http
  }
}
