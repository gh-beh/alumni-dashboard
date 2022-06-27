import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Merchant, NULL_NOTIF} from '../models/notification';
import {Subject} from 'rxjs';
import {ImgurService} from '../services/imgur.service';
import {takeUntil} from 'rxjs/operators';
import {NotificationService} from '../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
    notificationForm: FormGroup;
    defaultImage = 'assets/img/img-default.png';
    displayNotifs: Merchant[] = [];
    notifs: Merchant[] = [];
    showTable = true;
    showForm = false;
    formNotif: Merchant;
    emptyNotif: Merchant;
    createNotif = false;
    imageSrc = '';
    imgurUpload = true;
    submitted = false;
    searchText = '';
    statusMapping = ['Pending', 'Pushed'];

    private ngUnsub: Subject<any> = new Subject();

    constructor(private notifService: NotificationService, private imgur: ImgurService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.getNotifs();
        this.showTable = true;
        this.showForm = false;
        this.emptyNotif = NULL_NOTIF;
        this.formNotif = this.emptyNotif;
        this.notificationForm = this.formBuilder.group(
            {
                title: ['', Validators.required],
                description: ['', Validators.required],
            }
        );
    }

    get f(): { [key: string]: AbstractControl } {
        return this.notificationForm.controls;
    }

    getNotifs() {
        this.notifService.getNotifs().pipe(takeUntil(this.ngUnsub))
            .subscribe(
                res => {
                    this.notifs = (res.map(notif => ({
                        ...notif,
                    })));
                    this.setDisplay();
                });
    }

    addNotif() {
        this.createNotif = true;
        this.displayForm(this.emptyNotif);
    }

    editNotif(notif: Merchant) {
        this.createNotif = false;
        this.displayForm(notif);
    }

    displayForm(notif: Merchant) {
        this.formNotif = {...notif};
        this.submitted = false;
        this.imgurUpload = true;
        this.imageSrc = this.formNotif.image;
        this.showTable = false;
        this.showForm = true;
    }

    hideForm() {
        this.imageSrc = '';
        this.showTable = true;
        this.showForm = false;
        this.formNotif = {...this.emptyNotif};
    }

    submitForm() {
        if (this.notificationForm.invalid) { return; }
        this.submitted = true;
        // Create JSON body and parse dates
        const submitNotif = {...this.formNotif};

        if (this.imageSrc !== submitNotif.image) {
            // POST to imgur and retrieve link
            const imgurLink = this.imgur.uploadImg(this.extractData(this.imageSrc));
            imgurLink.pipe(takeUntil(this.ngUnsub)).subscribe(res => {
                submitNotif.image = res['data']['link'];
                this.imgurUpload = submitNotif.image !== '';
                if (this.imgurUpload) {
                    const response = this.createNotif
                        ? this.notifService.addNotif(submitNotif)
                        : this.notifService.updateNotif(submitNotif);
                    response.pipe(takeUntil(this.ngUnsub)).subscribe(() => {
                        this.getNotifs();
                        this.hideForm();
                    });
                }
            });
        } else {
            submitNotif.image = submitNotif.image || '';
            const response = this.createNotif ? this.notifService.addNotif(submitNotif) : this.notifService.updateNotif(submitNotif);
            response.pipe(takeUntil(this.ngUnsub)).subscribe(() => {
                this.getNotifs();
                this.hideForm();
            });
        }
    }

    removeNotif(id: number) {
        this.notifService.deleteNotif(id).pipe(takeUntil(this.ngUnsub)).subscribe(() =>
            this.getNotifs());
    }

    pushNotif(id: number) {
        this.notifService.pushNotif(id).pipe(takeUntil(this.ngUnsub)).subscribe(() =>
            this.getNotifs());
    }

    extractData(dataUrl: string): string {
        // TODO: Add error checking for dataURL base64 extraction
        return dataUrl.split(',')[1];
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
        this.displayNotifs = this.notifs.filter(
            s => s.title.toLowerCase().includes(this.searchText.toLowerCase())
                || s.description.toLowerCase().includes(this.searchText.toLowerCase()),
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
