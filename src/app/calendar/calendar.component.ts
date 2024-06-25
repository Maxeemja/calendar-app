import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CalendarService } from '../shared/calendar.service';
import { Appointment } from '../shared/appointment.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatCardModule, MatButtonModule],
  template: `
    <div class="calendar-container">
      <div *ngFor="let date of calendarDates; let i = index" class="calendar-day">
        <h3>{{ date | date:'shortDate' }}</h3>
        <div
          cdkDropList
          [id]="'list-' + i"
          [cdkDropListData]="getAppointmentsForDate(date)"
          [cdkDropListConnectedTo]="dropListIds"
          (cdkDropListDropped)="onDrop($event, date)"
          class="appointment-list">
          <mat-card
            *ngFor="let appointment of getAppointmentsForDate(date)"
            cdkDrag
            [cdkDragData]="appointment">
            <mat-card-title>{{ appointment.title }}</mat-card-title>
            <mat-card-content>
              <p>{{ appointment.description }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="warn" (click)="deleteAppointment(appointment.id)">Delete</button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .calendar-day {
      border: 1px solid #ccc;
      padding: 10px;
      width: 200px;
    }
    .appointment-list {
      min-height: 50px;
    }
  `]
})
export class CalendarComponent implements OnInit {
  appointments: Appointment[] = [];
  calendarDates!: Date[];
  dropListIds: string[] = [];

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.generateCalendarDates();
    this.calendarService.getAppointments().subscribe(appointments => {
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
    return this.appointments.filter(appointment => this.isSameDay(new Date(appointment.date), date));
  }

  onDrop(event: CdkDragDrop<Appointment[]>, targetDate: Date): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
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
        date: new Date(targetDate)
      };
      this.calendarService.updateAppointment(updatedAppointment);
    }
  }

  deleteAppointment(id: string): void {
    this.calendarService.deleteAppointment(id);
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}
