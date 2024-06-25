import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CalendarService } from '../shared/calendar.service';
import { Appointment } from '../shared/appointment.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatCardModule, MatButtonModule],
  template: `
    <div class="calendar-container">
      <div *ngFor="let date of calendarDates" class="calendar-day">
        <h3>{{ date | date:'dd-MMM-yyyy' }}</h3>
        <div cdkDropList (cdkDropListDropped)="onDrop($event)">
          <mat-card *ngFor="let appointment of (appointments$ | async)" cdkDrag
                    [class.same-day]="isSameDay(appointment.date, date)">
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
    .same-day {
      background-color: #e0e0e0;
    }
  `]
})
export class CalendarComponent implements OnInit {
  appointments$!: Observable<Appointment[]>;
  calendarDates!: Date[];

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.appointments$ = this.calendarService.getAppointments();
    this.generateCalendarDates();
  }

  generateCalendarDates(): void {
    const today = new Date();
    this.calendarDates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
  }

  onDrop(event: CdkDragDrop<Appointment[]>): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    // Update the appointment dates based on the new order
    // This is a simplified example and may need to be adjusted based on your specific requirements
    this.calendarService.updateAppointment(event.container.data[event.currentIndex]);
  }

  deleteAppointment(id: string): void {
    this.calendarService.deleteAppointment(id);
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }
}
