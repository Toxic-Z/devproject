import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLoaderComponent } from './components/data-loader/data-loader.component';
import { MenuComponent } from './components/menu/menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from '../app-routing.module';
import {MatTooltipModule} from '@angular/material/tooltip';



@NgModule({
    declarations: [DataLoaderComponent, MenuComponent],
  exports: [
    DataLoaderComponent,
    MenuComponent
  ],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        AppRoutingModule,
        MatTooltipModule
    ]
})
export class SharedModule { }
