import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [DashboardComponent ],
    imports: [
        CommonModule,
        MatListModule,
        RouterModule.forChild(routes),
        MatFormFieldModule,
        MatIconModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        FormsModule
    ]
})
export class DashboardModule { }
