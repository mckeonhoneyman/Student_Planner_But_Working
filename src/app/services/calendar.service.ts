import { Injectable } from '@angular/core';
import { signal, WritableSignal, computed, Signal } from '@angular/core';
import { DateTime } from 'luxon'; 
import { Event, EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})

export class CalendarService {
  today: Signal<DateTime> = signal(DateTime.local());
  activeDay: WritableSignal<DateTime> = signal(this.today());
  firstDayOfActiveMonth: WritableSignal<DateTime>;

  selectedView: WritableSignal<string> = signal("month");

  constructor(private eventService: EventService) {
    this.firstDayOfActiveMonth = signal(
      this.activeDay().startOf('month')
    );
  }

  getEventsForHour(date: string, hour: number): Event[] {
    const eventsForDay = this.getEventsForDate(date)();

    return eventsForDay.filter(event => {
      const [startHour] = event.sTime.split(':').map(Number);
      const [endHour] = event.eTime.split(':').map(Number);
  
      return startHour <= hour && hour < endHour;
    });
  }

  getEventsForDate(date: string): Signal<Event[]> {
    return computed(() => {
      const selectedDate = DateTime.fromISO(date);
      const result: Event[] = [];
  
      this.eventService.events().forEach(event => {
        const eventDate = DateTime.fromISO(event.date);
        const endDate = event.eDate ? DateTime.fromISO(event.eDate) : null;
  
        switch (event.recurring) {
          case 'daily':
            if(selectedDate >= eventDate && (!endDate || selectedDate <= endDate)){
              result.push(event);
            }
            break;

          case 'weekly':
            if(selectedDate >= eventDate && (!endDate || selectedDate <= endDate)){
              if (eventDate.weekday === selectedDate.weekday) {
                result.push(event);
              }
            }
            break;
  
          case 'biweekly':
            if(selectedDate >= eventDate && (!endDate || selectedDate <= endDate)){
              const diffWeeks = Math.floor(eventDate.diff(selectedDate, 'weeks').weeks);
              if (diffWeeks % 2 === 0 && eventDate.weekday === selectedDate.weekday) {
                result.push(event);
              }
            }
            break;

          case 'monthly':
            if(selectedDate >= eventDate && (!endDate || selectedDate <= endDate)){
              if (eventDate.day === selectedDate.day) {
                result.push(event);
              }
            }
            break;
  
          default: 
             if (event.date === date) {
               result.push(event);
             }
            break;
        }
      });
  
      return result;
    });
  }

  filterItem = ['Work', 'Class', 'Homework', 'Test', 'Exam', 'Meeting', 'Clubs', 'Study', 'Break', 'Other'];
  selectedFilter: WritableSignal<boolean[]> = signal([false, false, false, false, false, false, false, false, false, false]);

  toggleSelectedFilter(i: number) {
    const arr = this.selectedFilter();
    arr[i] = !arr[i];
    this.selectedFilter.set([...arr]);
  }

  eventVisible(event: Event): boolean {
    if(this.selectedFilter().every(value => value === false)){
      return true;
    }
    const cat = event.category;
    
    switch(cat){
      case "work":
        if(this.selectedFilter()[0]){
          return true;
        }
        break;
      case "class":
        if(this.selectedFilter()[1]){
          return true;
        }
        break;
      case "homework":
        if(this.selectedFilter()[2]){
          return true;
        }
        break;
      case "test":
        if(this.selectedFilter()[3]){
          return true;
        }
        break;
      case "exam":
        if(this.selectedFilter()[4]){
          return true;
        }
        break;
      case "meeting":
        if(this.selectedFilter()[5]){
          return true;
        }
        break;
      case "clubs":
        if(this.selectedFilter()[6]){
          return true;
        }
        break;
      case "study":
        if(this.selectedFilter()[7]){
          return true;
        }
        break;
      case "break":
        if(this.selectedFilter()[8]){
          return true;
        }
        break;
      case "other":
        if(this.selectedFilter()[9]){
          return true;
        }
        break;
      default:
        return false;
        break;
    }
    return false;
  }
}
