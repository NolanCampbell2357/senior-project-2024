import { Component } from '@angular/core';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from "@angular/forms";
import {MatCard} from "@angular/material/card";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFabButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {NgClass} from "@angular/common";
import {withEnabledBlockingInitialNavigation} from "@angular/router";
import {MatListOption, MatSelectionList} from "@angular/material/list";

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
    MatListOption
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  opened: boolean = false;
  icon: string = "chevron_right"
  protected readonly open = open;
  protected readonly iconChange = iconChange;
}

function iconChange() {
  var navButtonIcon = document.getElementById("nav-button-icon")

  if(navButtonIcon != null && navButtonIcon.textContent == "chevron_right"){
    navButtonIcon.textContent = "chevron_left";
  }
  else if(navButtonIcon != null && navButtonIcon.textContent == "chevron_left") {
    navButtonIcon.textContent = "chevron_right";
  }
}
