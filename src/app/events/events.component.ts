import {Component, OnDestroy, OnInit} from '@angular/core';
import {IntiEvent, MOCK_EVENTS, NULL_EVENT} from '../models/event';
import {EventsService} from '../services/events.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormControl, AbstractControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {ImgurService} from '../services/imgur.service';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-table-list',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {
  eventForm: FormGroup;
  defaultImage = 'assets/img/img-default.png';
  displayEvents: IntiEvent[] = [];
  events: IntiEvent[] = [];
  mockEvents: IntiEvent[];
  showTable = true;
  showForm = false;
  formEvent: IntiEvent;
  emptyEvent: IntiEvent;
  createEvent = false;
  imageSrc = '';
  imgurUpload = true;
  submitted = false;
  searchText = '';
  statusMapping = ['Hidden', 'Visible'];
  startTime = {hour: 12, minute: 0};
  endTime = {hour: 12, minute: 0};

  private ngUnsub: Subject<any> = new Subject();

  constructor(private eventService: EventsService, private imgur: ImgurService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getEvents();
    this.showTable = true;
    this.showForm = false;
    this.emptyEvent = NULL_EVENT;
    this.formEvent = this.emptyEvent;
    this.eventForm = this.formBuilder.group(
        {
          name: ['', Validators.required],
          description: ['', Validators.required],
          registerLink: ['', Validators.required],
          startDate: ['', Validators.required],
          endDate: ['', Validators.required],
          status: ['', Validators.required],
          startTime: ['', Validators.required],
          endTime: ['', Validators.required],
        }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.eventForm.controls;
  }

  getEvents() {
    this.eventService.getEvents().pipe(takeUntil(this.ngUnsub))
        .subscribe(
            res => {
              this.events = (res.map(event => ({
                ...event,
                status: event.status.toString(),
              })));
              this.setDisplay();
            });
  }

  addEvent() {
    this.createEvent = true;
    this.displayForm(this.emptyEvent);
    const now = new Date();
    this.f.startDate.setValue(now);
    this.f.endDate.setValue(now);
    this.startTime = {hour: now.getHours(), minute: now.getMinutes()};
    this.endTime = {hour: now.getHours() + 1, minute: now.getMinutes()};
  }

  editEvent(event: IntiEvent) {
    this.createEvent = false;
    this.displayForm(event);
    const startDateTime = this.parseFromDBDate(event.startDate);
    const endDateTime = this.parseFromDBDate(event.endDate);
    this.f.startDate.setValue(startDateTime);
    this.f.endDate.setValue(endDateTime);
    this.startTime = {hour: startDateTime.getHours(), minute: startDateTime.getMinutes()};
    this.endTime = {hour: endDateTime.getHours(), minute: endDateTime.getMinutes()};
  }

  displayForm(event: IntiEvent) {
    this.formEvent = {...event};
    this.submitted = false;
    this.imgurUpload = true;
    this.imageSrc = this.formEvent.image;
    this.showTable = false;
    this.showForm = true;
  }

  hideForm() {
    this.imageSrc = '';
    this.showTable = true;
    this.showForm = false;
    this.formEvent = {...this.emptyEvent};
    this.f.startDate.reset();
    this.f.endDate.reset();
  }

  submitForm() {
    if (!this.eventForm.valid) { return; }
    this.submitted = true;
    // Create JSON body and parse dates
    const submitEvent = {...this.formEvent};
    submitEvent.startDate = this.parseToDBDate(this.f.startDate.value, this.f.startTime.value);
    submitEvent.endDate = this.parseToDBDate(this.f.endDate.value,  this.f.endTime.value);

    if (this.imageSrc !== submitEvent.image) {
      // POST to imgur and retrieve link
      const imgurLink = this.imgur.uploadImg(this.extractData(this.imageSrc));
      imgurLink.pipe(takeUntil(this.ngUnsub)).subscribe(res => {
        submitEvent.image = res['data']['link'];
          this.imgurUpload = submitEvent.image !== '';
          if (this.imgurUpload) {
            const response = this.createEvent ? this.eventService.addEvent(submitEvent) : this.eventService.updateEvent(submitEvent);
            response.pipe(takeUntil(this.ngUnsub)).subscribe(() => {
              this.getEvents();
              this.hideForm();
            });
          }
      });
    } else {
      submitEvent.image = submitEvent.image || '';
      const response = this.createEvent ? this.eventService.addEvent(submitEvent) : this.eventService.updateEvent(submitEvent);
      response.pipe(takeUntil(this.ngUnsub)).subscribe(() => {
        this.getEvents();
        this.hideForm();
      });
    }
  }

  removeEvent(id: number) {
    this.eventService.deleteEvent(id).pipe(takeUntil(this.ngUnsub)).subscribe(() =>
        this.getEvents());
  }

  extractData(dataUrl: string): string {
    // TODO: Add error checking for dataURL base64 extraction
    return dataUrl.split(',')[1];
  }

  parseFromDBDate(dateStr: string): Date {
    // from yyyy-mm-dd hh:mm:ss to date
    const [date, time] = dateStr.split(' ');
    const [year, month, day] = date.split('-').map(str => parseInt(str, 10));
    const [hour, min, sec] = time.split(':').map(str => parseInt(str, 10));
    return new Date(year, month - 1, day, hour, min, sec);
  }

  parseToDBDate(date: Date, time: NgbTimeStruct): string {
    // parse from ISO value into yyyy-mm-dd hh:mm:ss
    const {hour, minute} = time;
    date.setHours(hour);
    date.setMinutes(minute);
    // Fix timezone to GMT +8, en-GB locale format "dd/mm/yyyy, hh:mm:ss"
    const [dd, mm] = date.toLocaleString('en-GB', {timeZone: 'Singapore'}).split(/[/, ]/);
    let [, , yyyy] = date.toLocaleString('en-GB', {timeZone: 'Singapore'}).split(/[/, ]/);
    const [, , , , hhmmss] = date.toString().split(' ');
    // Manual error catching to prevent bad data passed into db crashing api server
    if (parseInt(yyyy, 10) < 1970) { yyyy = '1970' }
    return `${yyyy}-${mm}-${dd} ${hhmmss}`;
  }

  readURL(event: Event): void {
    if ('files' in event.target && event.target['files'][0]) {
      const file = event.target['files'][0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result as string;

      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imageSrc = '';
  }

  setDisplay() {
    this.displayEvents = this.events.filter(
        s => s.name.toLowerCase().includes(this.searchText.toLowerCase())
            || s.description.toLowerCase().includes(this.searchText.toLowerCase())
            || s.registerLink.toLowerCase().includes(this.searchText.toLowerCase())
            || this.statusMapping[s.status] === this.searchText,
    );
  }

  resetSearch() {
    this.searchText = '';
    this.setDisplay();
  }

  onClearSearch() {
    if (this.searchText === '') { this.setDisplay(); }
  }

  ngOnDestroy(): any {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }
}
