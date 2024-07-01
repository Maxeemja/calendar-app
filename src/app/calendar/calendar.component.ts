import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CalendarService } from '../shared/calendar.service';
import { Appointment } from '../shared/appointment.model';
import { DayViewComponent } from '../day-view/day-view.component';
import { EditAppointmentComponent } from '../edit-appointment/edit-appointment.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
})
export class CalendarComponent implements OnInit {
  appointments: Appointment[] = [];
  calendarDates!: Date[];
  dropListIds: string[] = [];

  constructor(
    private calendarService: CalendarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.generateCalendarDates();
    this.calendarService.getAppointments().subscribe((appointments) => {
      this.appointments = appointments;
    });
    this.dropListIds = this.calendarDates.map((_, i) => `list-${i}`);
  }

  generateCalendarDates(): void {
    const today = new Date();
    this.calendarDates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    return this.appointments.filter((appointment) =>
      this.isSameDay(new Date(appointment.date), date)
    );
  }

  onDrop(event: CdkDragDrop<Appointment[]>, targetDate: Date): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedAppointment = event.container.data[event.currentIndex];
      const updatedAppointment: Appointment = {
        ...movedAppointment,
        date: new Date(targetDate),
      };
      this.calendarService.updateAppointment(updatedAppointment);
    }
  }

  deleteAppointment(id: string): void {
    this.calendarService.deleteAppointment(id);
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  openDayView(date: Date): void {
    this.dialog.open(DayViewComponent, {
      data: { date, appointments: this.getAppointmentsForDate(date) },
      width: '400px',
    });
  }

  editAppointment(appointment: Appointment): void {
    const dialogRef = this.dialog.open(EditAppointmentComponent, {
      data: { appointment },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.calendarService.updateAppointment(result);
      }
    });
  }
}
