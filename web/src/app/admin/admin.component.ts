import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  MatButtonModule,
  MatFabButton,
  MatIconButton
} from '@angular/material/button';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {
  MatFormField,
  MatHint,
  MatLabel,
  MatSuffix
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgForOf } from '@angular/common';
import {
  MatListModule,
  MatListOption,
  MatSelectionList
} from '@angular/material/list';
import { TForm } from '../form-object/TForm';
import { MatCheckbox } from '@angular/material/checkbox';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// import {TForm} from "functions/post-form/src/types/TForm.ts";

@Component({
  selector: 'app-admin',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatSidenavModule,
    MatButtonModule,
    FormsModule,
    MatCard,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFabButton,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    MatIconModule,
    MatIconButton,
    NgClass,
    MatSelectionList,
    MatListOption,
    MatListModule,
    NgForOf,
    MatCheckbox,
    ReactiveFormsModule,
    MatDatepickerModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}
  private baseUrl =
    'https://vsv7otixtd.execute-api.us-east-2.amazonaws.com/default';
  private headers: HttpHeaders = new HttpHeaders({
    'Access-Control-Allow-Headers':
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Access-Control-Allow-Headers,Access-Control-Allow-Origin',
    'Access-Control-Allow-Origin': '*',
    'X-Api-Key': 's72QDvMGEKaLlvoQB8mFt8E8Z7xzwTVL1GwyLhiX'
  });

  ngOnInit() {
    this.getForms();
  }

  opened: boolean = false;
  submittedForms: TForm[] = [];
  //Admin Display Fields
  firstNameField?: string = 'My Name';
  certNameField?: string = '';
  ROCRequestedField: boolean = false;
  personalDevelopmentField: boolean = false;
  reasonField?: string = '';
  estimatedCompletionTimeField?: string = '';
  estimatedCompletionDateField?: string = '';
  certExpirationDateField?: string = '';
  certCostField?: Number = -1;
  nameOfPreviousCertField?: string = '';
  dateOfPreviousCertField?: string = '';
  employeeSignOffDateField?: string = '';
  leadSignOffDateField?: string = undefined;
  executiveSignOffDateField?: string = undefined;
  protected readonly open = open;

  adminForm = this.formBuilder.group({
    estimatedCompletionDate: { value: '', disabled: true },
    certExpirationDate: { value: '', disabled: true },
    dateOfPreviousCert: { value: '', disabled: true },
    employeeSignOffDate: { value: '', disabled: true },
    leadSignOffDate: { value: '', disabled: false },
    executiveSignOffDate: { value: '', disabled: false }
  });

  getForms() {
    const url = this.baseUrl + '/form';
    this.http.get(url, { headers: this.headers }).subscribe((data) => {
      if (!data) {
        return null;
      }
      Object.assign(this.submittedForms, data);
      return this.submittedForms;
    });
  }

  approveForm(formId: string) {
    if (formId != null && formId != '' && formId != '-1') {
      let selectedForm: TForm = this.getSelectedForm(formId);

      const leadSignOffDate: string =
        this.adminForm.value.leadSignOffDate ?? '';
      const executiveSignOffDate: string =
        this.adminForm.value.executiveSignOffDate ?? '';
      const approved: boolean =
        selectedForm?.employeeSignOffDate &&
        leadSignOffDate &&
        executiveSignOffDate
          ? true
          : false;

      let body = {
        employeeSignOffDate: selectedForm?.employeeSignOffDate ?? '',
        leadSignOffDate,
        executiveSignOffDate,
        approved
      };

      console.log(body);

      selectedForm.leadSignOffDate = leadSignOffDate ?? undefined;
      selectedForm.executiveSignOffDate = executiveSignOffDate ?? undefined;

      console.log('Approving form: ' + formId);
      const url: string = this.baseUrl + ('/form/' + formId + '/approve');
      this.http.post(url, body, { headers: this.headers }).subscribe((data) => {
        console.log(data);
      });

      this.snackBar.open(
        `Form Approved ${approved ? 'Successfully' : 'Unsuccessfully'}`,
        'Close',
        { duration: 10000 }
      );
    }
  }

  denyForm(formId: string) {
    if (formId != null && formId != '' && formId != '-1') {
      let selectedForm: TForm = this.getSelectedForm(formId);
      let todayDate = new Date();

      let body = {
        employeeSignOffDate: selectedForm.employeeSignOffDate ?? '',
        leadSignOffDate: '',
        executiveSignOffDate: '',
        approved: false
      };

      selectedForm.leadSignOffDate = undefined;
      selectedForm.executiveSignOffDate = undefined;

      this.adminForm.value.leadSignOffDate = undefined;
      this.adminForm.value.executiveSignOffDate = undefined;

      this.leadSignOffDateField = undefined;
      this.executiveSignOffDateField = undefined;

      console.log('Denying form: ' + formId);
      const url: string = this.baseUrl + ('/form/' + formId + '/approve');
      this.http.post(url, body, { headers: this.headers }).subscribe((data) => {
        console.log(data);
      });

      this.snackBar.open(`Form Approval Denied`, 'Close', { duration: 10000 });
    }
  }

  //Get object from id
  getSelectedForm(formId: String) {
    if (this.submittedForms.length >= 1) {
      let i: number;
      for (i = 0; i < this.submittedForms.length; i++) {
        if (this.submittedForms[i].id == formId) {
          return this.submittedForms[i];
        }
      }
    }
    let emptyForm: TForm = { id: '-1' };
    return emptyForm;
  }

  //Update field values for user
  updateFields(currentFormId: string) {
    let selectedForm: TForm = this.getSelectedForm(currentFormId);

    if (
      selectedForm != null &&
      selectedForm.id != '-1' &&
      selectedForm.id != ''
    ) {
      this.firstNameField = selectedForm.employeeName;
      this.certNameField = selectedForm.certName;
      this.ROCRequestedField = selectedForm.ROCRequested ?? false;
      this.personalDevelopmentField = selectedForm.personalDevelopment ?? false;
      this.reasonField = selectedForm.reason;
      this.estimatedCompletionTimeField = selectedForm.estimatedCompletionTime;
      this.estimatedCompletionDateField = selectedForm.estimatedCompletionDate;
      this.certExpirationDateField = selectedForm.certExpirationDate;
      this.certCostField = selectedForm.certCost;
      this.nameOfPreviousCertField = selectedForm.nameOfPreviousCert;
      this.dateOfPreviousCertField = selectedForm.dateOfPreviousCert;
      this.employeeSignOffDateField = selectedForm.employeeSignOffDate;
      this.leadSignOffDateField = selectedForm.leadSignOffDate;
      this.executiveSignOffDateField = selectedForm.executiveSignOffDate;
    }
  }

  //Alternate sidenav icon (< and >)
  iconChange() {
    let navButtonIcon = document.getElementById('nav-button-icon');

    if (navButtonIcon != null && navButtonIcon.textContent == 'chevron_right') {
      navButtonIcon.textContent = 'chevron_left';
    } else if (
      navButtonIcon != null &&
      navButtonIcon.textContent == 'chevron_left'
    ) {
      navButtonIcon.textContent = 'chevron_right';
    }
  }
}
