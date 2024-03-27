import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ReimbursementFormComponent } from "./reimbursement-form/reimbursement-form.component";
import { CommonModule } from '@angular/common';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {AdminComponent} from "./admin/admin.component";
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
  imports: [RouterOutlet, ReimbursementFormComponent, CommonModule, RouterModule, MatTabGroup, MatTab, AdminComponent]
})
export class AppComponent {
  title = 'web';
}

