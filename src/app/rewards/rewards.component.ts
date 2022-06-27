import {Component, OnDestroy, OnInit} from '@angular/core';
import {Reward} from '../models/reward';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {ImgurService} from '../services/imgur.service';
import {takeUntil} from 'rxjs/operators';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {RewardService} from '../services/reward.service';
import {MerchantService} from '../services/merchant.service';
import {Merchant} from '../models/merchant';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css']
})
export class RewardsComponent implements OnInit, OnDestroy {
  rewardForm: FormGroup;
  defaultImage = 'assets/img/img-default.png';
  displayRewards: Reward[] = [];
  rewards: Reward[] = [];
  showTable = true;
  showForm = false;
  formReward: Reward;
  emptyReward: Reward;
  createReward = false;
  imageSrc = '';
  imgurUpload = true;
  submitted = false;
  searchText = '';
  statusMapping = ['Hidden', 'Visible'];
  startTime = {hour: 12, minute: 0};
  endTime = {hour: 12, minute: 0};
  expiryTime = {hour: 12, minute: 0};
  voucherTypeMapping = ['Period', 'Days'];
  merchants: Merchant[] = [];

  private ngUnsub: Subject<any> = new Subject();

  constructor(
      private rewardService: RewardService,
      private imgur: ImgurService,
      private merchantService: MerchantService,
      private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.merchantService.getMerchants().pipe(takeUntil(this.ngUnsub))
        .subscribe(res => {
          this.merchants = (res.length === 0 ? [] : res);
        });
    this.getRewards();
    this.showTable = true;
    this.showForm = false;
    this.emptyReward = null;
    this.formReward = this.emptyReward;
    this.rewardForm = this.formBuilder.group(
        {
          code: ['', Validators.required],
          description: ['', Validators.required],
          expiryType: ['', Validators.required],
          expiryDate: [''],
          expiryDay: [''],
          startDate: ['', Validators.required],
          endDate: ['', Validators.required],
          merchantId: ['', Validators.required],
          title: ['', Validators.required],
          voucherClaimableAmount: ['', Validators.required],
          voucherLimit: ['', Validators.required],
          startTime: ['', Validators.required],
          endTime: ['', Validators.required],
          expiryTime: [''],
        }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.rewardForm.controls;
  }

  getRewards() {
    this.rewardService.getEvents().pipe(takeUntil(this.ngUnsub))
        .subscribe(
            res => {
              this.rewards = (res.map(reward => ({
                ...reward,
                status: reward.status.toString(),
              })));
              this.setDisplay();
            });
  }

  addReward() {
    this.createReward = true;
    this.displayForm(this.emptyReward);
    const now = new Date();
    this.f.startDate.setValue(now);
    this.f.endDate.setValue(now);
    this.f.expiryDate.setValue(now);
    this.startTime = {hour: now.getHours(), minute: now.getMinutes()};
    this.endTime = {hour: now.getHours() + 1, minute: now.getMinutes()};
  }

  editReward(reward: Reward) {
    this.createReward = false;
    this.displayForm(reward);
    const startDateTime = this.parseFromDBDate(reward.startDate);
    const endDateTime = this.parseFromDBDate(reward.endDate);
    const expiryDateTime = this.parseFromDBDate(reward.expiryDate);
    this.f.startDate.setValue(startDateTime);
    this.f.endDate.setValue(endDateTime);
    this.f.expiryDate.setValue(expiryDateTime);
    this.startTime = {hour: startDateTime.getHours(), minute: startDateTime.getMinutes()};
    this.endTime = {hour: endDateTime.getHours(), minute: endDateTime.getMinutes()};
    this.expiryTime = {hour: expiryDateTime.getHours(), minute: expiryDateTime.getMinutes()};
  }

  displayForm(reward: Reward) {
    this.formReward = {...reward};
    this.submitted = false;
    this.imgurUpload = true;
    this.imageSrc = this.formReward.image;
    this.showTable = false;
    this.showForm = true;
  }

  hideForm() {
    this.imageSrc = '';
    this.showTable = true;
    this.showForm = false;
    this.formReward = {...this.emptyReward};
    this.f.startDate.reset();
    this.f.endDate.reset();
  }

  submitForm() {
    if (this.rewardForm.invalid) { return; }
    this.submitted = true;
    console.log(this.startTime);
    // Create JSON body and parse dates
    const submitReward = {...this.formReward};
    submitReward.startDate = this.parseToDBDate(this.f.startDate.value, this.f.startTime.value);
    submitReward.endDate = this.parseToDBDate(this.f.endDate.value,  this.f.endTime.value);
    submitReward.expiryDate = this.parseToDBDate(this.f.expiryDate.value,  this.f.expiryTime.value);

    if (this.imageSrc !== submitReward.image) {
      // POST to imgur and retrieve link
      const imgurLink = this.imgur.uploadImg(this.extractData(this.imageSrc));
      imgurLink.pipe(takeUntil(this.ngUnsub)).subscribe(res => {
        submitReward.image = res['data']['link'];
        this.imgurUpload = submitReward.image !== '';
        if (this.imgurUpload) {
          const response = this.createReward ? this.rewardService.addEvent(submitReward) : this.rewardService.updateEvent(submitReward);
          response.pipe(takeUntil(this.ngUnsub)).subscribe(() => {
            this.getRewards();
            this.hideForm();
          });
        }
      });
    } else {
      submitReward.image = submitReward.image || '';
      const response = this.createReward ? this.rewardService.addEvent(submitReward) : this.rewardService.updateEvent(submitReward);
      response.pipe(takeUntil(this.ngUnsub)).subscribe(() => {
        this.getRewards();
        this.hideForm();
      });
    }
  }

  removeReward(id: number) {
    this.rewardService.deleteEvent(id).pipe(takeUntil(this.ngUnsub)).subscribe(() =>
        this.getRewards());
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
    this.displayRewards = this.rewards.filter(
        s => s.code.toLowerCase().includes(this.searchText.toLowerCase())
            || s.description.toLowerCase().includes(this.searchText.toLowerCase())
            || s.merchantName.toLowerCase().includes(this.searchText.toLowerCase())
            || s.title.toLowerCase().includes(this.searchText.toLowerCase())
            || this.voucherTypeMapping[s.expiryType] === this.searchText,
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
