import { Component } from '@angular/core';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: '../../../styles.css'
})
export class HeaderComponent {
  title = "Risen One Employee Portal"
  textColor = "#FFF"
}

