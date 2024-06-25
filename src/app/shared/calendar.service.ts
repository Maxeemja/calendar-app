import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from './appointment.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private appointments: Appointment[] = [];
  private appointments$ = new BehaviorSubject<Appointment[]>([]);

  getAppointments(): Observable<Appointment[]> {
    return this.appointments$.asObservable();
  }

  addAppointment(appointment: Appointment): void {
    this.appointments.push(appointment);
    this.appointments$.next([...this.appointments]);
  }

  deleteAppointment(id: string): void {
    this.appointments = this.appointments.filter(app => app.id !== id);
    this.appointments$.next([...this.appointments]);
  }

  updateAppointment(updatedAppointment: Appointment): void {
    const index = this.appointments.findIndex(app => app.id === updatedAppointment.id);
    if (index !== -1) {
      this.appointments[index] = updatedAppointment;
      this.appointments$.next([...this.appointments]);
    }
  }
}
