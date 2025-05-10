import { Component, Signal, computed } from '@angular/core';
import { DateTime } from 'luxon';
import { CommonModule } from '@angular/common';
import { CalendarService } from '../../services/calendar.service';
import { Router, RouterOutlet } from '@angular/router';
import { Event, EventService } from '../../services/event.service';

@Component({
  selector: 'app-week',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './week.component.html',
  styleUrl: './week.component.css'
})
export class WeekComponent {
  constructor(public calendarService: CalendarService, private router: Router, public eventService: EventService) {}

  hours: string[] = Array.from({ length: 24 }, (_, i) =>
    DateTime.fromObject({ hour: i }).toFormat('h a')
  );

  firstDayOfActiveWeek: Signal<DateTime> = computed(() => {
    const refDay = this.calendarService.activeDay();
    return refDay.minus({ days: refDay.weekday % 7 }).startOf('day');
  });

  weekDates: Signal<DateTime[]> = computed(() => {
    const start = this.firstDayOfActiveWeek();
    return Array.from({ length: 7 }, (_, i) => start.plus({ days: i }));
  });

  eventsByDayHour(date: DateTime, hour: number): Event[] {
    const dateStr = date.toISODate();
    if (!dateStr) return [];
  
    return this.calendarService.getEventsForHour(dateStr, hour);
  }

  goToPreviousWeek(): void {
    const ref = this.calendarService.activeDay();
    this.calendarService.activeDay.set(ref.minus({ weeks: 1 }));
  }

  goToNextWeek(): void {
    const ref = this.calendarService.activeDay();
    this.calendarService.activeDay.set(ref.plus({ weeks: 1 }));
  }

  weekRange: Signal<string> = computed(() => {
    const dates = this.weekDates();
    return `${dates[0].toFormat('MMM dd')} - ${dates[6].toFormat('MMM dd, yyyy')}`;
  });

  goToDayView(date: DateTime): void {
    this.calendarService.activeDay.set(date);
    this.router.navigate(['/day']);
  }

  eventsByDay(date: DateTime): Event[] {
    const dateStr = date.toISODate();
    if (!dateStr) return [];
    return this.calendarService.getEventsForDate(dateStr)();
  }
  
  
  onEventClick(event: Event): void {
    this.eventService.viewEvent(event);
  }
  
  getWeekEventStyle(event: Event): any {
    const start = DateTime.fromISO(`${event.date}T${event.sTime}`);
    const end = DateTime.fromISO(`${event.date}T${event.eTime}`);
  
    const hourHeight = 35; // Matches .time-slot height exactly
    const startHours = start.hour + start.minute / 60;
    let endHours = end.hour + end.minute / 60;

if (end.hour === 0 && end.minute === 0) {
  endHours = 24;
}
  
    const top = startHours * hourHeight;
    const height = (endHours - startHours) * hourHeight;
  
    
    return {
      position: 'absolute',
      top: `${top}px`,
      height: `${height}px`,
      left: '4px',
      right: '4px',
      'background-color': event.color || '#90caf9',
      'border-left': '3px solid black',
      'border-radius': '4px',
      padding: '4px',
      overflow: 'hidden',
      cursor: 'pointer',
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      'justify-content': 'center',
      'text-align': 'center',
      'box-sizing': 'border-box',
    };
  }
}

