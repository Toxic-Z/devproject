import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { ApiService } from '../../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from '../../../shared/services/common.service';
import { Employee } from '../../../shared/interfaces/employee';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    MatSnackBar
  ]
})
export class DashboardComponent implements OnInit {
  public files = [];
  public employeeForms: {form: FormGroup, id: number}[] = [];
  public employeesList: Employee[] = [];
  public editableList: number[] = [];
  public isCreating = false;
  private newItemsIdIndex = Math.random();
  private initialStateOfEmployees: Employee[] = [];
  public searchKeyWord = '';

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    this.updateEmployeesList();
  }

  private updateEmployeesList(): void {
    this.apiService.fetchEmployees()
      .then(
        (employees: Employee[]) => {
          console.log(employees);
          this.commonService.changeLoaderVisibility(false);
          this.employeesList = employees ? [...employees] : [];
          this.employeesList.forEach((e: Employee) => {
            this.employeeForms.push(
              {
                form: this.initForm(e),
                id: e.id
              }
            );
          });
          this.employeeForms = [...this.employeeForms];
          this.commonService.changeLoaderVisibility(false);
        },
        (error => {
          this.showMessage(error);
        })
      );
  }

  private initForm(employee: Employee): FormGroup {
    return new FormGroup({
      name: new FormControl({
          value: employee.name,
          disabled: !this.checkEditListById(employee.id)
        },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)]),
      email: new FormControl({
          value: employee.email,
          disabled: !this.checkEditListById(employee.id)
        },
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30)]),
      addDate: new FormControl({
          value: employee.addDate,
          disabled: !this.checkEditListById(employee.id)
        },
        [
          Validators.required]),
      phone: new FormControl({
          value: employee.phone,
          disabled: !this.checkEditListById(employee.id)
        },
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(10)]),
      age: new FormControl({
          value: employee.age,
          disabled: !this.checkEditListById(employee.id)
        },
        [
          Validators.required,
          Validators.minLength(14),
          Validators.maxLength(100)]),
      photo: new FormControl({
          value: employee.photo,
          disabled: !this.checkEditListById(employee.id)
        },
        [
          Validators.required,
          Validators.min(1),
          Validators.max(9999)]),
      resume: new FormControl({
          value: employee.resume,
          disabled: !this.checkEditListById(employee.id)
        },
        [
          Validators.required,
          Validators.minLength(30),
          Validators.maxLength(300)])
    });
  }

  public uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element);
    }
  }

  public deleteAttachment(index: number, id: number) {
    this.files.splice(index, 1);
    this.findForm(id).get('photo').setValue(null);
  }

  public findForm(id: number): FormGroup {
    return this.employeeForms.filter((i: {form: FormGroup, id: number}) => i.id === id)[0].form;
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Done!', {
      duration: 2000,
    });
  }

  public fetchFilteredList(): Employee[] {
    const temporaryArray = [...this.employeesList];
    if (this.searchKeyWord) {
      return temporaryArray.filter((e: Employee) => e.name.toLocaleLowerCase().includes(this.searchKeyWord));
    } else {
      return temporaryArray;
    }
  }

  public addNewEmployee(): void {
    const newEmployee: Employee = {
      name: null,
      email: null,
      phone: null,
      age: null,
      photo: null,
      resume: null,
      addDate: new Date(),
      id: this.newItemsIdIndex
    };
    this.editableList.push(this.newItemsIdIndex);
    this.isCreating = true;
    this.employeesList.unshift({...newEmployee});
    this.employeeForms.push(
      {
        form: this.initForm({...newEmployee}),
        id: newEmployee.id
      }
    );
  }

  public parseDate(date: Date): string {
    return this.commonService.dateToMoment(date);
  }

  public toEditList(employee: Employee): void {
    if (!this.editableList.includes(employee.id)) {
      this.editableList.push(employee.id);
      this.initialStateOfEmployees.push(employee);
      const index = this.employeeForms.findIndex((i: {form: FormGroup, id: number}) => i.id === employee.id);
      if (!this.isCreating) {
        for (const control in this.employeeForms[index].form.controls) {
          this.employeeForms[index].form.get(`${control}`).enable();
        }
      }
    }
  }

  public fromEditList(employee: Employee): void {
    if (this.editableList.includes(employee.id)) {
      const delIndex = this.editableList.indexOf(employee.id);
      this.editableList.splice(delIndex, 1);
      const index = this.employeeForms.findIndex((i: {form: FormGroup, id: number}) => i.id === employee.id);
      for (const control in this.employeeForms[index].form.controls) {
        this.employeeForms[index].form.get(`${control}`).disable();
      }
    }
  }

  // public onGenderClick(employee: Employee): void {
  //   if (this.checkEditListById(employee.id)) {
  //     employee.gender === 'm' ? employee.gender = 'f' : employee.gender = 'm';
  //   } else {
  //     return;
  //   }
  // }

  public deleteEmployee(id: number): void {
    this.apiService.deleteEmployee(id).then(
      () => {
        this.commonService.changeLoaderVisibility(false);
        this.updateEmployeesList();
        this.showMessage('Deleted successfully!');
      },
      error => {
        this.showMessage(`Error: ${error}`);
      }
    );
  }

  public toAction(employee: Employee, type: string): void {
    const form = this.findForm(employee.id).value;
    const value: Employee = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      age: form.age,
      addDate: form.addDate,
      photo: form.photo,
      resume: form.resume,
      id: employee.id
    };
    switch (this.editableList.includes(employee.id)) {
      case true:
        switch (type) {
          case 'edit':
            if (employee.id === this.newItemsIdIndex && this.findForm(employee.id).valid) {
              this.apiService.createEmployee(value).then(
                () => {
                  this.newItemsIdIndex = Math.random();
                  this.updateEmployeesList();
                  this.fromEditList(value);
                  this.isCreating = false;
                  this.showMessage('Created successfully!');
                },
                error => {
                  this.showMessage(`Error: ${error}`);
                }
              );
            } else if (this.findForm(employee.id).valid) {
              this.apiService.updateEmployee(value).then(
                () => {
                  this.updateEmployeesList();
                  this.fromEditList(value);
                  this.showMessage('Updated successfully!');
                },
                error => {
                  this.showMessage(`Error: ${error}`);
                }
              );
            } else {
              this.showMessage('Form validation error!');
            }
            break;
          case 'delete':
            const index = this.editableList.indexOf(employee.id);
            const eIndex = this.employeesList.indexOf(employee);
            this.editableList.splice(index, 1);
            if (employee.id === this.newItemsIdIndex) {
              this.employeesList.shift();
              this.isCreating = false;
            } else {
              this.employeesList[eIndex] = this.initialStateOfEmployees.filter((e: Employee) => e.id === employee.id)[0];
              if (!this.isCreating) {
                this.fromEditList(value);
                const initial: Employee = this.initialStateOfEmployees.filter((i: Employee) => i.id === employee.id)[0];
                this.employeeForms.filter((i: {form: FormGroup, id: number}) => i.id === employee.id)[0].form = this.initForm(initial);
                break;
              }
            }
            break;
        }
        break;
      case false:
        switch (type) {
          case 'edit':
            this.toEditList(value);
            break;
          case 'delete':
            this.deleteEmployee(employee.id);
            break;
        }
        break;
    }
  }

  public checkEditListById(id: number): boolean {
    return this.editableList.includes(id);
  }
}
