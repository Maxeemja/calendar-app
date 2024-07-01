import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Appointment } from '../shared/appointment.model';

@Component({
  selector: 'app-day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatListModule, MatButtonModule],
})
export class DayViewComponent {
  constructor(
    public dialogRef: MatDialogRef<DayViewComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { date: Date; appointments: Appointment[] }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
