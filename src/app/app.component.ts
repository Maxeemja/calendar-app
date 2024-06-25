import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary">
      <span>Calendar App</span>
      <a mat-button routerLink="/">Calendar</a>
      <a mat-button routerLink="/add-appointment">Add Appointment</a>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    mat-toolbar {
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class AppComponent {
  title = 'calendar-app';
}
