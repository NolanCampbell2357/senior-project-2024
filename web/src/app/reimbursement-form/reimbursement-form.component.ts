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
import { FormsModule } from '@angular/forms';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
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
    MatInputModule
  ]
})
export class ReimbursementFormComponent {
  exportToPDF() {
    var data = document.getElementById('pdf')!;
    html2canvas(data).then((canvas) => {
      var imgWidth = 290;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var date = new Date()
      
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf.jsPDF('l', 'mm', 'a4'); // A4 size page of PDF
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      
      pdf.save(`${date.toLocaleString()} Reimbursement Form`); // Generated PDF
    });

  }
}
