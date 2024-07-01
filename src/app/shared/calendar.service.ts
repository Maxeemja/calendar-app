import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from './appointment.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private appointments: Appointment[] = [];
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  private items: Appointment[] = JSON.parse(
    localStorage.getItem('items') ?? '[]'
  );

  getAppointments(): Observable<Appointment[]> {
    if (this.items.length) {
      this.appointments = this.items;
      this.appointmentsSubject.next(this.items);
    }
    return this.appointmentsSubject.asObservable();
  }

  addAppointment(appointment: Appointment): void {
    localStorage.setItem('items', JSON.stringify([...this.items, appointment]));
    this.appointments.push(appointment);
    this.appointmentsSubject.next([...this.appointments]);
  }

  deleteAppointment(id: string): void {
    const result = this.items.filter((item) => item.id !== id);
    localStorage.setItem('items', JSON.stringify(result));
    this.appointments = result;
    this.appointmentsSubject.next([...this.appointments]);
  }

  updateAppointment(updatedAppointment: Appointment): void {
    console.log(updatedAppointment);
    const index = this.appointments.findIndex(
      (app) => app.id === updatedAppointment.id
    );
    if (index !== -1) {
      const updatedItems = this.items.map((item: any) =>
        item.id === updatedAppointment.id ? updatedAppointment : item
      );
      localStorage.setItem('items', JSON.stringify(updatedItems));
      this.appointments[index] = updatedAppointment;
      this.appointmentsSubject.next([...this.appointments]);
    }
  }
}
