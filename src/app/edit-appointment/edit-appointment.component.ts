import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { Appointment } from '../shared/appointment.model';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
})
export class EditAppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appointment: Appointment }
  ) {}

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      title: [this.data.appointment.title, Validators.required],
      date: [this.data.appointment.date, Validators.required],
      description: [this.data.appointment.description],
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const updatedAppointment: Appointment = {
        ...this.data.appointment,
        ...this.appointmentForm.value,
      };
      this.dialogRef.close(updatedAppointment);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
