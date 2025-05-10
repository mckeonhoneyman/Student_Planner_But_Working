import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule,NgForm, NgModel } from '@angular/forms';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'eventView',
  templateUrl: './eventView.component.html',
  styleUrl: './eventView.component.css',
  imports: [CommonModule,FormsModule],
  standalone: true
})
export class EventView {
  constructor(public eventService:EventService) {}
  @Input() sidebar:string = '';
  get eventsAsString(): string {
    const allEvents = this.eventService.events();
    return allEvents
      .map(event =>
        `${event.eventName} ${event.date} ${event.sTime} ${event.eTime} ${event.recurring ?? ''} ${event.eDate ?? ''} ${event.description ?? ''} ${event.category ?? ''} ${event.color ?? ''}`
      )
      .join('\n\n');
  }

  
  saveEvent(eventName:string,date:string,sTime:string,eTime:string,recurring?:string,eDate?:string,description?:string,category?:string,color?:string): void {
      this.eventService.saveEvent({
        eventName, date, sTime, eTime, recurring, eDate, description, category, color
      });
      
    }

}
