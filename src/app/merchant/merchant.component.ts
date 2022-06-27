import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Merchant, NULL_MERCHANT} from '../models/merchant';
import {Subject} from 'rxjs';
import {ImgurService} from '../services/imgur.service';
import {takeUntil} from 'rxjs/operators';
import {MerchantService} from '../services/merchant.service';
declare var $: any;

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.css']
})

export class MerchantComponent implements OnInit, OnDestroy {
    merchantForm: FormGroup;
    defaultImage = 'assets/img/img-default.png';
    displayMerchants: Merchant[] = [];
    merchants: Merchant[] = [];
    showTable = true;
    showForm = false;
    formMerchant: Merchant;
    emptyMerchant: Merchant;
    createMerchant = false;
    imageSrc = '';
    imgurUpload = true;
    submitted = false;
    searchText = '';
    statusMapping = ['Pending', 'Pushed'];

    private ngUnsub: Subject<any> = new Subject();

    constructor(private merchantService: MerchantService, private imgur: ImgurService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.getMerchants();
        this.showTable = true;
        this.showForm = false;
        this.emptyMerchant = NULL_MERCHANT;
        this.formMerchant = this.emptyMerchant;
        this.merchantForm = this.formBuilder.group(
            {
                name: ['', Validators.required],
            }
        );
    }

    get f(): { [key: string]: AbstractControl } {
        return this.merchantForm.controls;
    }

    getMerchants() {
        this.merchantService.getMerchants().pipe(takeUntil(this.ngUnsub))
            .subscribe(
                res => {
                    this.merchants = (res.map(merchant => ({
                        ...merchant,
                    })));
                    this.setDisplay();
                });
    }

    addMerchant() {
        this.createMerchant = true;
        this.displayForm(this.emptyMerchant);
    }

    editMerchant(merchant: Merchant) {
        this.createMerchant = false;
        this.displayForm(merchant);
    }

    displayForm(merchant: Merchant) {
        this.formMerchant = {...merchant};
        this.submitted = false;
        this.imgurUpload = true;
        this.imageSrc = this.formMerchant.logo;
        this.showTable = false;
        this.showForm = true;
    }

    hideForm() {
        this.imageSrc = '';
        this.showTable = true;
        this.showForm = false;
        this.formMerchant = {...this.emptyMerchant};
    }

    submitForm() {
        this.submitted = true;
        if (this.merchantForm.invalid) { return; }
        // Create JSON body and parse dates
        const submitMerchant = {...this.formMerchant};

        if (this.imageSrc !== submitMerchant.logo) {
            // POST to imgur and retrieve link
            const imgurLink = this.imgur.uploadImg(this.extractData(this.imageSrc));
            imgurLink.pipe(takeUntil(this.ngUnsub)).subscribe(res => {
                submitMerchant.logo = res['data']['link'];
                this.imgurUpload = submitMerchant.logo !== '';
                if (this.imgurUpload) {
                    const response = this.createMerchant
                        ? this.merchantService.addMerchant(submitMerchant)
                        : this.merchantService.updateMerchant(submitMerchant);
                    response.pipe(takeUntil(this.ngUnsub)).subscribe(() => {
                        this.getMerchants();
                        this.hideForm();
                    });
                }
            });
        } else {
            submitMerchant.logo = submitMerchant.logo || '';
            const response = this.createMerchant
                ? this.merchantService.addMerchant(submitMerchant)
                : this.merchantService.updateMerchant(submitMerchant);
            response.pipe(takeUntil(this.ngUnsub)).subscribe(() => {
                this.getMerchants();
                this.hideForm();
            });
        }
    }

    removeMerchant(id: number) {
        this.merchantService.deleteMerchant(id).pipe(takeUntil(this.ngUnsub)).subscribe(res => {
            if (res.hasOwnProperty('error')) {
                this.showErrorNotification(
                    `${res.error.name}: ${res.error.status} ${res.error.statusText}`,
                    `Something went wrong while trying to remove record with id ${id}!`,
                );
            }
            this.getMerchants();
        });
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
        this.displayMerchants = this.merchants.filter(
            s => s.name.toLowerCase().includes(this.searchText.toLowerCase()),
        );
    }

    resetSearch() {
        this.searchText = '';
        this.setDisplay();
    }

    onClearSearch() {
        if (this.searchText === '') { this.setDisplay(); }
    }

    showErrorNotification(title: string, message: string) {
        $.notify({
            title,
            message,
        }, {
            type: 'danger',
            timer: 200,
            placement: {
                from: 'bottom',
                align: 'right'
            },
            template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
                '<i class="material-icons" data-notify="icon">error</i> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '</div>'
        });
    }

    ngOnDestroy(): any {
        this.ngUnsub.next();
        this.ngUnsub.complete();
    }
}
