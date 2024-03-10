import { Component } from '@angular/core';
import { HeaderComponent } from "../layout/header/header.component";
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-reimbursement-form',
    standalone: true,
    templateUrl: './reimbursement-form.component.html',
    styleUrls: ['./reimbursement-form.component.css', "../../styles.css"],
    providers: [provideNativeDateAdapter()],
    imports: [HeaderComponent, MatDividerModule,FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule,MatInputModule]
})

export class ReimbursementFormComponent {
}
