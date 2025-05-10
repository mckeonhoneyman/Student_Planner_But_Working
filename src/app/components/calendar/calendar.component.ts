import { Component,InputSignal,Signal,WritableSignal,computed,input,signal, } from '@angular/core';
import { DateTime, Info, Interval } from 'luxon';
import { CommonModule } from '@angular/common';
import { CalendarService } from '../../services/calendar.service';
import { RouterOutlet } from '@angular/router';
import { Event, EventService } from '../../services/event.service';


@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class CalendarComponent {

  constructor(public calendarService: CalendarService, public eventService: EventService) {}

  get firstDayOfActiveMonth(): WritableSignal<DateTime>{
    return this.calendarService.firstDayOfActiveMonth;
  }

  daysOfMonth: Signal<DateTime[]> = computed(() => { // makes sunday the first day of the week
    const firstDay = this.firstDayOfActiveMonth();
    const startOfCalendar = firstDay
      .minus({ days: firstDay.weekday % 7 })
      .startOf('day');
  
    const endOfMonth = firstDay.endOf('month');
    const endOfCalendar = endOfMonth
      .plus({ days: 6 - (endOfMonth.weekday % 7) })
      .endOf('day');
  
    return Interval.fromDateTimes(startOfCalendar, endOfCalendar)
      .splitBy({ days: 1 })
      .map(interval => {
        if (!interval.start) throw new Error('Invalid interval');
        return interval.start;
      });
  });
  DATE_MED = DateTime.DATE_MED;
  goToPreviousMonth(): void {
    this.calendarService.firstDayOfActiveMonth.set(
      this.firstDayOfActiveMonth().minus({ month: 1 }),
    );
  }

  weekDays: Signal<string[]> = signal([ // makes sunday the first day of the week
    ...Info.weekdays('short').slice(-1),
    ...Info.weekdays('short').slice(0, 6)
  ]);

  goToNextMonth(): void {
    this.firstDayOfActiveMonth.set(
      this.firstDayOfActiveMonth().plus({ month: 1 }),
    );
  }

  goToToday(): void {
    this.calendarService.activeDay.set(this.calendarService.today());
    this.firstDayOfActiveMonth.set(this.calendarService.today().startOf('month'));
  }

  goToPreviousDay(): void {
      const ref = this.calendarService.activeDay() ?? this.calendarService.today();
      this.calendarService.activeDay.set(ref.minus({ days: 1 }));
  }

  goToNextDay(): void {
    const ref = this.calendarService.activeDay() ?? this.calendarService.today();
      this.calendarService.activeDay.set(ref.plus({ days: 1 }));
  }

  hours: string[] = Array.from({ length: 24 }, (_, i) =>
    DateTime.fromObject({ hour: i }).toFormat('h a')
  );
  
  //Returns the date of the active day or today if no active day is set
  dayDate: Signal<DateTime> = computed(() => {
    return this.calendarService.activeDay() ?? this.calendarService.today();
  });

  getThreeEventsForDay(date: DateTime): Event[] {
    return this.calendarService.getEventsForDate(date?.toISODate() ?? "")().slice(0, 3);
  }

  getDayEventStyle(event: Event): any {
    
    return {
      width: '100%', 
      'max-width': '100%', 
      position: 'relative',
      height: `20px`,
      'background-color': event.color || '#90caf9',
      'border-radius': '4px',
      padding: '1px',
      overflow: 'hidden',
      cursor: 'pointer',
      display: 'block',
      'flex-direction': 'column',
      'align-items': 'center',
      'justify-content': 'center',
      'text-align': 'center',
      'box-sizing': 'border-box',
      'margin-top': '3px',
    };
  }
}