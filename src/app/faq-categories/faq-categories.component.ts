import {Component, OnDestroy, OnInit} from '@angular/core';
import {FaqCat, MOCK_FAQ_CATS, NULL_FAQ_CAT} from '../models/faq';
import {FaqCatService} from '../services/faq-cat.service';
import {takeUntil, catchError} from 'rxjs/operators';
import {of, Subject} from 'rxjs';
import {AbstractControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-faq-category',
  templateUrl: './faq-categories.component.html',
  styleUrls: ['./faq-categories.component.css']
})
export class FaqCategoryComponent implements OnInit, OnDestroy {
  displayFaqCats: FaqCat[];
  faqCats: FaqCat[];
  showTable: boolean;
  showForm: boolean;
  formFaqCat: FaqCat;
  emptyFaqCat: FaqCat;
  createFaqCat: boolean;
  faqCatForm: FormGroup;
  submitted = false;
  searchText = '';

  private ngUnsub: Subject<any> = new Subject();

  constructor(private faqCatService: FaqCatService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getFaqCats();
    this.showTable = true;
    this.showForm = false;
    this.emptyFaqCat = NULL_FAQ_CAT;
    this.formFaqCat = this.emptyFaqCat;
    this.faqCatForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        recordStatus: ['', Validators.required],
      },
    );
  }

  getFaqCats() {
    this.faqCatService.getFaqCats().pipe(takeUntil(this.ngUnsub))
        .subscribe(res => {
            this.faqCats = res;
            this.setDisplay();
        });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.faqCatForm.controls;
  }

  addFaqCat() {
    this.createFaqCat = true;
    this.displayForm(this.emptyFaqCat);
  }

  editFaqCat(faqCat: FaqCat) {
    this.createFaqCat = false;
    this.displayForm(faqCat);
  }

  removeFaqCat(id: number) {
    this.faqCatService.deleteFaqCat(id).pipe(takeUntil(this.ngUnsub)).subscribe(res => {
      if (res.hasOwnProperty('error')) {
        this.showErrorNotification(
          `${res.error.name}: ${res.error.status} ${res.error.statusText}`,
          `Something went wrong while trying to remove record with id ${id}!`,
        );
      } else { this.showSuccessNotification('Success!', `Removed FAQ Category record with id ${id}`) }
      this.getFaqCats();
    });
  }

  displayForm(faqCat: FaqCat) {
    this.formFaqCat = {...faqCat};
    this.showTable = false;
    this.submitted = false;
    this.showForm = true;
  }

  hideForm() {
    this.showTable = true;
    this.showForm = false;
    this.formFaqCat = {...this.emptyFaqCat};
  }

  submitForm() {
    if (!this.faqCatForm.valid) { return; }
    this.submitted = true;
    // POST here
    const submitFaq = {...this.formFaqCat};
    const response = this.createFaqCat
        ? this.faqCatService.addFaqCat(submitFaq)
        : this.faqCatService.updateFaqCat(submitFaq);
    response.pipe(takeUntil(this.ngUnsub)).subscribe(() => {
      this.getFaqCats();
      this.hideForm();
    });
  }

  setDisplay() {
    this.displayFaqCats = this.faqCats.filter(
      s => s.name.toLowerCase().includes(this.searchText.toLowerCase()) || s.recordStatus === this.searchText,
    );
  }

  resetSearch() {
    this.searchText = '';
    this.setDisplay();
  }

  onClearSearch() {
    if (this.searchText === '') { this.setDisplay(); }
  }

  showErrorNotification(title: string, message: string){
    $.notify({
      title,
      message,
    },{
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

  showSuccessNotification(title: string, message: string){
    $.notify({
      title,
      message,
    },{
      type: 'success',
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
