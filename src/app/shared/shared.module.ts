import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLoaderComponent } from './components/data-loader/data-loader.component';
import { MenuComponent } from './components/menu/menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from '../app-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { FooterComponent } from './components/footer/footer.component';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
export function migrationFactory() {
  // The animal table was added with version 2 but none of the existing tables or data needed
  // to be modified so a migrator for that version is not included.
  return {
    1: (db, transaction) => {
      // const store = transaction.objectStore('people');
      // store.createIndex('country', 'country', { unique: false });
    },
    3: (db, transaction) => {
      // const store = transaction.objectStore('users');
      // store.createIndex('age', 'age', { unique: false });
    }
  };
}
const dbConfig: DBConfig  = {
  name: 'Database',
  version: 3,
  objectStoresMeta: [
    {
      store: 'employees',
      storeConfig: { keyPath: 'email', autoIncrement: false },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false }},
        { name: 'email', keypath: 'email', options: { unique: true }},
        { name: 'phone', keypath: 'phone', options: { unique: false }},
        { name: 'addDate', keypath: 'addDate', options: { unique: false }},
        { name: 'age', keypath: 'age', options: { unique: false }},
        { name: 'resume', keypath: 'resume', options: { unique: false }},
        { name: 'photo', keypath: 'photo', options: { unique: false }},
        { name: 'id', keypath: 'id', options: { unique: true }}
      ]
    },
    {
      store: 'users',
      storeConfig: { keyPath: 'login', autoIncrement: false },
      storeSchema: [
        { name: 'login', keypath: 'login', options: { unique: true }},
        { name: 'password', keypath: 'password', options: { unique: false }}
      ]
    },
    {
      store: 'currUser',
      storeConfig: { keyPath: 'login', autoIncrement: false },
      storeSchema: [
        { name: 'login', keypath: 'login', options: { unique: true }},
        { name: 'password', keypath: 'password', options: { unique: false }}
      ]
    }
  ],
  migrationFactory
};
@NgModule({
    declarations: [DataLoaderComponent, MenuComponent, FooterComponent],
  exports: [
    DataLoaderComponent,
    MenuComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    AppRoutingModule,
    MatTooltipModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    MatListModule,
    MatMenuModule
  ]
})
export class SharedModule { }
