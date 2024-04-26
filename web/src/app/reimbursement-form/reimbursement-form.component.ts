import { Component } from '@angular/core';
import { HeaderComponent } from '../layout/header/header.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import {
  AbstractControl,
  FormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import  {v4 as uuid}  from 'uuid'
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-reimbursement-form',
  standalone: true,
  templateUrl: './reimbursement-form.component.html',
  styleUrls: ['./reimbursement-form.component.css', '../../styles.css'],
  providers: [provideNativeDateAdapter()],
  imports: [
    HeaderComponent,
    MatDividerModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIcon
  ]
})

export class ReimbursementFormComponent {
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar ) {}
  private bucketName = "rsp-web";
  private baseUrl =
    'https://vsv7otixtd.execute-api.us-east-2.amazonaws.com/default';
  private headers: HttpHeaders = new HttpHeaders({
    'Access-Control-Allow-Headers':
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Access-Control-Allow-Headers,Access-Control-Allow-Origin',
    'Access-Control-Allow-Origin': '*',
    'X-Api-Key': 's72QDvMGEKaLlvoQB8mFt8E8Z7xzwTVL1GwyLhiX'
  });
  forms: TForm[] = [];
  selectedForm: TForm = {
    id: ''
  };
  todayDate = new Date();
  file!: File;
  
  reimbursementForm = this.formBuilder.group({
    employeeName: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        this.forbiddenCharacterValidator(/[$&+,:;=?@#|'<>.^*()%!-]/)
      ]
    ],
    certName: ['', [Validators.required, Validators.minLength(3)]],
    ROCRequested: [''],
    personalDevelopment: [''],
    reason: ['', [Validators.required]],
    estimatedCompletionTime: ['', [Validators.required]],
    estimatedCompletionDate: ['', Validators.required],
    certExpirationDate: ['', [Validators.required]],
    certCost: ['', [Validators.required, Validators.min(0)]],
    nameOfPreviousCert: [''],
    dateOfPreviousCert: [''],
    employeeSignOffDate: { value: new Date() },
    leadSignOffDate: { value: null, disabled: true },
    executiveSignOffDate: { value: null, disabled: true }
  });

  ngOnInit() {
    this.getForms();
  }

  getForms() {
    const url = this.baseUrl + '/form';
    this.http.get(url, { headers: this.headers }).subscribe((data) => {
      if (!data) {
        return null;
      }
      Object.assign(this.forms, data);
      return this.forms;
    });
  }

  getSelectedForm(event: string) {
    this.selectedForm = this.getForm(event);
  }

  getForm(id: string): TForm {
    for (let form of this.forms) {
      if (form.id == id) {
        return form;
      }
    }
    return { id: '' };
  }

  viewFile(fileId: string) {
  const url = `http://rsp-web.s3-website.us-east-2.amazonaws.com/${fileId}`
    window.open(url,'_blank');
  }


  exportToPDF() {
    var data = document.getElementById('pdf')!;
    html2canvas(data).then((canvas) => {
      var imgWidth = 290;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var date = new Date();

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf.jsPDF('l', 'mm', 'a4'); // A4 size page of PDF
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);

      pdf.save(`${date.toLocaleString()} Reimbursement Form`); // Generated PDF
    });
  }

  async submitForm() {
    let fileId = "";
    let body = {
      employeeName: this.reimbursementForm.value.employeeName,
      certName: this.reimbursementForm.value.certName,
      ROCRequested: this.reimbursementForm.value.ROCRequested,
      personalDevelopment: this.reimbursementForm.value.personalDevelopment,
      reason: this.reimbursementForm.value.reason,
      estimatedCompletionTime:
        this.reimbursementForm.value.estimatedCompletionTime,
      estimatedCompletionDate:
        this.reimbursementForm.value.estimatedCompletionDate,
      certExpirationDate: this.reimbursementForm.value.certExpirationDate,
      certCost: this.reimbursementForm.value.certCost,
      nameOfPreviousCert: this.reimbursementForm.value.nameOfPreviousCert,
      dateOfPreviousCert: this.reimbursementForm.value.dateOfPreviousCert,
      employeeSignOffDate: this.reimbursementForm.value.employeeSignOffDate,
      file: fileId,
    }; 

    const id  = this.selectedForm.id ? ("/"+this.selectedForm.id) : "";
    console.log(this.selectedForm)

    if(this.file) {
      fileId = uuid();
      const url = "https://szcf2csx50.execute-api.us-east-2.amazonaws.com/default/"
      await this.http.put(url+`${this.bucketName}/${fileId}`, this.file, {headers: this.headers}).subscribe((res) => {
      body.file = fileId;
      if(this.reimbursementForm.valid && fileId != null ){
        const url = this.baseUrl + "/form" + id
        this.http.post(url, body, {headers: this.headers}).subscribe((data) => {
          if(data) {
            this.snackBar.open('Form Successfully Uploaded',"Close", {duration: 10000})
          }
          console.log(data);
          if(!id) {
            console.log("add")
            this.forms.push(data);
            this.selectedForm = data;
          }
        })
      } 
    });
    }  else {
      if(this.reimbursementForm.valid){
        const url = this.baseUrl + "/form" + id
        this.http.post(url, body, {headers: this.headers}).subscribe((data) => {
          console.log(data);
          if(!id) {
            console.log("add")
            this.forms.push(data);
            this.selectedForm = data;
          }
        })
      } 
    }


  }

  createNewForm() {
    this.selectedForm = {};
    this.reimbursementForm.reset();
    this.reimbursementForm.markAsPristine();
    this.reimbursementForm.markAsUntouched();
  }

  forbiddenCharacterValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }
}

export interface TForm {
  id?: String;
  employeeName?: string;
  certName?: string;
  ROCRequested?: boolean;
  personalDevelopment?: boolean;
  reason?: string;
  estimatedCompletionTime?: string;
  estimatedCompletionDate?: Date;
  certExpirationDate?: Date;
  certCost?: Number;
  nameOfPreviousCert?: string;
  dateOfPreviousCert?: Date;
  employeeSignOffDate?: Date;
  leadSignOffDate?: Date;
  executiveSignOffDate?: Date;
  file?: string;
}
