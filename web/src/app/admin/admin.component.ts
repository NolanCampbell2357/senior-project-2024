import {Component} from '@angular/core';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule, MatFabButton, MatIconButton} from "@angular/material/button";
import {FormBuilder, FormsModule} from "@angular/forms";
import {MatCard} from "@angular/material/card";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {NgClass, NgForOf} from "@angular/common";
import {MatListModule, MatListOption, MatSelectionList} from "@angular/material/list";
import {TForm} from "../form-object/TForm";
import {MatCheckbox} from "@angular/material/checkbox";
import {HttpClient, HttpHeaders} from "@angular/common/http";

// import {TForm} from "functions/post-form/src/types/TForm.ts";

@Component({
  selector: 'app-admin',
  standalone: true,
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
    MatCheckbox
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  constructor(private http: HttpClient, ) {}
  private baseUrl =
    'https://fmpfbaicr5.execute-api.us-east-2.amazonaws.com/test';
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
  dateObj: Date = new Date();
  submittedForms: TForm[] = [];
  //Admin Display Fields
  firstNameField: String = "My Name";
  certNameField: String = "";
  ROCRequestedField: boolean = false;
  personalDevelopmentField: boolean = false;
  reasonField: String = "";
  estimatedCompletionTimeField: String = "";
  estimatedCompletionDateField: Date = this.dateObj;
  certExpirationDateField: Date = this.dateObj;
  certCostField: Number = -1;
  nameOfPreviousCertField: String = "";
  dateOfPreviousCertField: Date = this.dateObj;
  employeeSignOffDateField: Date = this.dateObj;
  leadSignOffDateField: Date = this.dateObj;
  executiveSignOffDateField: Date = this.dateObj;
  protected readonly open = open;

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

  //TODO
  approveForm(formId: string) {
    if(formId != null && formId != '' && formId != '-1') {
      let selectedForm: TForm = this.getSelectedForm(formId);
      let todayDate = new Date();

      let body = {
        employeeSignOffDate: selectedForm?.employeeSignOffDate ?? "",
        leadSignOffDate: todayDate,
        executiveSignOffDate: selectedForm?.executiveSignOffDate ?? "",
        approved: true,
      };

      console.log("Approving form: "+ formId);
      const url: string = this.baseUrl + ('/form/'+ formId + '/approve');
      this.http.post(url, body,
        { headers: this.headers }).subscribe((data) => {
        console.log(data);
      })
    }
  }

  //TODO
  denyForm(formId: string) {
    if(formId != null && formId != '' && formId != '-1') {
      let selectedForm: TForm = this.getSelectedForm(formId);
      let todayDate = new Date();

      let body = {
        employeeSignOffDate: selectedForm.employeeSignOffDate,
        leadSignOffDate: "",
        executiveSignOffDate: selectedForm?.executiveSignOffDate ?? "",
        approved: false,
      };

      console.log("Denying form: "+ formId);
      const url: string = this.baseUrl + ('/form/'+ formId + '/approve');
      this.http.post(url, body,
        { headers: this.headers }).subscribe((data) => {
        console.log(data);
      })
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
    let emptyForm: TForm = {id: "-1"};
    return emptyForm;
  }

  //Update field values for user
  updateFields(currentFormId: string) {
    let selectedForm: TForm = this.getSelectedForm(currentFormId);

    if (selectedForm != null && selectedForm.id != "-1" && selectedForm.id != "") {
      this.firstNameField = <String>selectedForm.employeeName;
      this.certNameField = <String>selectedForm.certName;
      this.ROCRequestedField = <boolean>selectedForm.ROCRequested;
      this.personalDevelopmentField = <boolean>selectedForm.personalDevelopment;
      this.reasonField = <String>selectedForm.reason;
      this.estimatedCompletionTimeField = <String>selectedForm.estimatedCompletionTime;
      this.estimatedCompletionDateField = <Date>selectedForm.estimatedCompletionDate;
      this.certExpirationDateField = <Date>selectedForm.certExpirationDate;
      this.certCostField = <Number>selectedForm.certCost;
      this.nameOfPreviousCertField = <String>selectedForm.nameOfPreviousCert;
      this.dateOfPreviousCertField = <Date>selectedForm.dateOfPreviousCert;
      this.employeeSignOffDateField = <Date>selectedForm.employeeSignOffDate;
      this.leadSignOffDateField = <Date>selectedForm.leadSignOffDate;
      this.executiveSignOffDateField = <Date>selectedForm.executiveSignOffDate;
    }
  }

  //Alternate sidenav icon (< and >)
  iconChange() {
    let navButtonIcon = document.getElementById("nav-button-icon")

    if (navButtonIcon != null && navButtonIcon.textContent == "chevron_right") {
      navButtonIcon.textContent = "chevron_left";
    } else if (navButtonIcon != null && navButtonIcon.textContent == "chevron_left") {
      navButtonIcon.textContent = "chevron_right";
    }
  }
}
