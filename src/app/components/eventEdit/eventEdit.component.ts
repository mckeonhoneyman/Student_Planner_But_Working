import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule,NgForm, NgModel } from '@angular/forms';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'eventEdit',
  templateUrl: './eventEdit.component.html',
  styleUrl: './eventEdit.component.css',
  imports: [CommonModule,FormsModule],
  standalone: true
})
export class EventEdit {
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
  selectEventCatagory():number{
    switch(this.eventService.tempEvent.category){
      case('noCategory'):{
        return 0;
      }case('work'):{
        return 1;
      }case('class'):{
        return 2;
      }case('homework'):{
        return 3;
      }case('test'):{
        return 4;
      }case('exam'):{
        return 5;
      }case('meeting'):{
        return 6;
      }case('clubs'):{
        return 7;
      }case('study'):{
        return 8;
      }case('break'):{
        return 9;
      }case('other'):{
        return 10;
      }
      default:{return -1}
    }
  }

  selectEventColor():number{
    switch(this.eventService.tempEvent.color){
      default:{return 0}
      case('red'):{
        return 1
      }
      case("blue"):{
        return 2
      }
      case('orange'):{
        return 3
      }
      case('yellow'):{
        return 4
      }
      case('green'):{
        return 5
      }
      case('purple'):{
        return 6
      }
      case('cyan'):{
        return 7
      }
      case('grey'):{
        return 8
      }
      case('brown'):{
        return 9
      }
    }
  }

  selectEventRecursion():number{
    switch(this.eventService.tempEvent.recurring){
      default:{return 0}
      case('none'):{return 1}
      case('daily'):{return 2}
      case('weekly'):{return 3}
      case('biweekly'):{return 4}
      case('monthly'):{return 5}
    }
  }
  resaveEvent(eventName:string,date:string,sTime:string,eTime:string,recurring?:string,eDate?:string,description?:string,category?:string,color?:string):void{
    this.eventService.deleteEvent(this.eventService.tempEvent.id)
    this.saveEvent(eventName, date, sTime, eTime, recurring, eDate, description, category, color)
  }
}
