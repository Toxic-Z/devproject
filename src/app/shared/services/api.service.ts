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
  constructor(
    // private httpClient: HttpClient, -- for real http
    private commonService: CommonService,
    private dbService: NgxIndexedDBService
  ) {
  }

  public fetchEmployees(): Promise<Employee[]> {
    return this.dbService.getAll('employees');
    // return this.httpClient.get<Employee[]>(this.url); --for real http
  }

  public updateEmployee(employee: Employee): Promise<any> {
    return this.dbService.update('employees', employee);
    // return this.httpClient.put<boolean>(this.url + employee._id, employee); --for real http

  }

  public createEmployee(employee: Employee): Promise<any> {
    return this.dbService.add('employees', employee);
    // return this.httpClient.post<boolean>(this.url, employee); --for real http
  }

  public deleteEmployee(id: number): Promise<any> {
    return this.dbService.delete('employees', id);
    // return this.httpClient.delete<boolean>(this.url + id); --for real http
  }
}
