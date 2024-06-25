import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from './appointment.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private appointments: Appointment[] = [];
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);

  getAppointments(): Observable<Appointment[]> {
    return this.appointmentsSubject.asObservable();
  }

  addAppointment(appointment: Appointment): void {
    this.appointments.push(appointment);
    this.appointmentsSubject.next([...this.appointments]);
  }

  deleteAppointment(id: string): void {
    this.appointments = this.appointments.filter(app => app.id !== id);
    this.appointmentsSubject.next([...this.appointments]);
  }

  updateAppointment(updatedAppointment: Appointment): void {
    const index = this.appointments.findIndex(app => app.id === updatedAppointment.id);
    if (index !== -1) {
      this.appointments[index] = updatedAppointment;
      this.appointmentsSubject.next([...this.appointments]);
    }
  }
}
