import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CalendarService } from '../shared/calendar.service';
import { Appointment } from '../shared/appointment.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  template: `
    <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <input matInput placeholder="Title" formControlName="title">
      </mat-form-field>
      <mat-form-field>
        <input matInput [matDatepicker]="picker" placeholder="Date" formControlName="date">
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
      <mat-form-field>
        <textarea matInput placeholder="Description" formControlName="description"></textarea>
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit" [disabled]="!appointmentForm.valid">Add Appointment</button>
    </form>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      max-width: 300px;
      margin: 20px auto;
    }
  `]
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private calendarService: CalendarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      title: ['', [Validators.required]],
      date: [new Date(), [Validators.required]],
      description: ['']
    });

    this.appointmentForm.valueChanges.subscribe(value => {
      console.log('Form value changed:', value);
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const appointment: Appointment = {
        id: crypto.randomUUID(),
        title: this.appointmentForm.value.title,
        description: this.appointmentForm.value.description,
        date: new Date(this.appointmentForm.value.date) // Ensure this is a Date object
      };
      this.calendarService.addAppointment(appointment);
      this.appointmentForm.reset();
      this.router.navigate(['/']);
    }
  }
}
