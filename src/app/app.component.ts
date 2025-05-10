import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { WeekComponent } from "./components/week/week.component";
import { DayComponent } from "./components/day/day.component";
import { EventCreation } from './components/eventCreation/eventCreation.component';
import { EventView } from './components/eventView/eventView.component';
import { EventEdit } from './components/eventEdit/eventEdit.component';
import { EventService } from './services/event.service';
import { CalendarService } from './services/calendar.service';

// this is essentially acting as our display component
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalendarComponent, CommonModule, WeekComponent, DayComponent, EventCreation,EventEdit,EventView],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(public calendarService: CalendarService){}

  eventService1 = inject(EventService);
  title = 'Student_planner_app';
  sidebar='create'

  dropdownOpen = false;

  setSidebar(){
    this.sidebar=this.eventService1.sidebar();
  }
}
