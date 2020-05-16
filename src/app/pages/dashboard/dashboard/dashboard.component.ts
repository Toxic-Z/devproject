import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  ],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  public files: {files: File[], id: number, flag?: boolean}[] = [];
  private temporaryFileArr: {file: File, id: number, flag?: boolean}[] = [];
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
  ) {}

  ngOnInit(): void {
    this.updateEmployeesList();
  }

  private updateEmployeesList(): void {
    this.apiService.fetchEmployees()
      .then(
        (employees: Employee[]) => {
          this.commonService.changeLoaderVisibility(false);
          this.files = [];
          this.employeeForms = [];
          this.employeesList = employees ? [...employees] : [];
          this.initialStateOfEmployees = employees ? [...employees] : [];
          this.employeesList.forEach((e: Employee) => {
            this.employeeForms.push(
              {
                form: this.initForm(e),
                id: e.id
              }
            );
            if (e.photo.length) {
              this.files.push({
                files: e.photo,
                id: e.id,
                flag: false
              });
            }
          });
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

  public uploadFile(event, id) {
    const fileList: FileList = event.target.files;
    const index = this.files.findIndex((i: {files: File[], id: number}) =>
      i.id === id);
    const files: File[] = [];
    if (fileList.length > 0) {
      Object.keys(fileList).map((i) => {
        this.temporaryFileArr.push({
          id,
          file: fileList[i],
          flag: true
        });
        if (index >= 0) {
          this.files[index].files.push(fileList[i]);
        } else {
          files.push(fileList[i]);
        }
      });
    }
  }

  public fetchFiles(id: number) {
    return this.files.filter(i => i.id === id);
  }

  public deleteFile(index: number, id: number) {
    const ind = this.files.findIndex((i: {files: File[], id: number}) =>
      i.id === id);
    this.temporaryFileArr.push({
      id,
      file: this.files[ind].files[index]
    });
    this.files[ind].files.splice(index, 1);
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

  public toEditList(employee: Employee): void {
    if (!this.editableList.includes(employee.id)) {
      this.editableList.push(employee.id);
      const index = this.employeeForms.findIndex((i: {form: FormGroup, id: number}) => i.id === employee.id);
      for (const control in this.employeeForms[index].form.controls) {
        this.employeeForms[index].form.get(`${control}`).enable();
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
      photo: this.fetchFiles(employee.id).length ?
        this.fetchFiles(employee.id)[0].files : [],
      resume: form.resume,
      id: employee.id
    };
    switch (this.editableList.includes(employee.id)) {
      case true:
        switch (type) {
          case 'edit':
            if (!this.checkForFiles(employee.id)) {
              this.showMessage('You should upload at least one file!');
              return;
            }
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
              const ind = this.files.findIndex((i: {files: File[], id: number}) =>
                i.id === employee.id);
              this.employeesList[eIndex] = this.initialStateOfEmployees.filter((e: Employee) => e.id === employee.id)[0];
              this.fromEditList(value);
              const initial: Employee = this.initialStateOfEmployees.filter((i: Employee) => i.id === employee.id)[0];
              this.temporaryFileArr
                .filter(i => i.id === employee.id)
                .filter(i => i.flag !== true).forEach(file => {
                this.files[ind].files.push(file.file);
              });
              this.temporaryFileArr = this.temporaryFileArr.filter(i => !i.flag).filter(i => i.id !== employee.id);
              console.log(this.temporaryFileArr);
              this.employeeForms.filter((i: {form: FormGroup, id: number}) => i.id === employee.id)[0].form = this.initForm(initial);
              break;
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

  public checkForFiles(id: number): boolean {
    return !!(this.fetchFiles(id).length && this.fetchFiles(id)[0].files.length);
  }

  public checkEditListById(id: number): boolean {
    return this.editableList.includes(id);
  }
}
