import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
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
    MatButtonModule,
  ],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
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
      description: [''],
    });

    this.appointmentForm.valueChanges.subscribe((value) => {
      console.log('Form value changed:', value);
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const appointment: Appointment = {
        id: crypto.randomUUID(),
        title: this.appointmentForm.value.title,
        description: this.appointmentForm.value.description,
        date: new Date(this.appointmentForm.value.date),
      };
      this.calendarService.addAppointment(appointment);
      this.appointmentForm.reset();
      this.router.navigate(['/']);
    }
  }
}
