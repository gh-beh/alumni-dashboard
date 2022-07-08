import {Component, OnDestroy, OnInit} from '@angular/core';
import {Faq, FAQ_STATUS_MAPPING, FaqCat, MOCK_FAQ_CATS, MOCK_FAQS, NULL_FAQ} from '../models/faq';
import {FaqService} from '../services/faq.service';
import {FaqCatService} from '../services/faq-cat.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {FormBuilder, Validators, FormGroup, AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit, OnDestroy {
  mockFaqs: Faq[];
  faqForm: FormGroup;
  displayFaqs: Faq[] = [];
  faqs: Faq[];
  faqCats: FaqCat[] = [];
  faqCatNameMapping = {};
  showTable: boolean;
  showForm: boolean;
  formFaq: Faq;
  emptyFaq: Faq;
  createFaq: boolean;
  submitted: boolean;
  searchText = '';
  faqRecordStatusLabels = FAQ_STATUS_MAPPING;

  private ngUnsub: Subject<any> = new Subject();

  constructor(private faqService: FaqService, private faqCatService: FaqCatService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.faqCatService.getFaqCats().pipe(takeUntil(this.ngUnsub))
        .subscribe(res => {
          this.faqCatNameMapping = {};
          this.faqCats = (res.length === 0 ? MOCK_FAQ_CATS : res);
          this.faqCats.forEach(faqCat => {
            this.faqCatNameMapping[faqCat.faqCatId.toString()] = faqCat.name;
          });
        });
    this.getFaqs();
    this.showTable = true;
    this.showForm = false;
    this.emptyFaq = NULL_FAQ;
    this.formFaq = this.emptyFaq;
    this.faqForm = this.formBuilder.group(
      {
        question: ['', Validators.required],
        answer: ['', Validators.required],
        faqCatId: ['', Validators.required],
        recordStatus: ['', Validators.required],
      },
    )
  }

  getFaqs() {
    this.faqService.getFaqs().pipe(takeUntil(this.ngUnsub))
        .subscribe(res => {
            this.faqs = res;
            this.setDisplay();
        });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.faqForm.controls;
  }

  addFaq() {
    this.createFaq = true;
    this.displayForm(this.emptyFaq);
  }

  editFaq(faq: Faq) {
    this.createFaq = false;
    this.displayForm(faq);
  }

  removeFaq(id: number) {
    this.faqService.deleteFaq(id).pipe(takeUntil(this.ngUnsub)).subscribe(() =>
        this.getFaqs());
  }

  displayForm(faq: Faq) {
    this.formFaq = {...faq};
    this.f.faqCatId.setValue(faq.faqCatId.toString());
    this.showTable = false;
    this.submitted = false;
    this.showForm = true;
  }

  hideForm() {
    this.showTable = true;
    this.showForm = false;
    this.formFaq = {...this.emptyFaq};
  }

  submitForm() {
    if (!this.faqForm.valid) { return; }
    this.submitted = true;
    // POST here
    const submitFaq = {...this.formFaq, faqCatId: parseInt(this.f.faqCatId.value, 10)};
    const response = this.createFaq
        ? this.faqService.addFaq(submitFaq)
        : this.faqService.updateFaq(submitFaq);
    response.pipe(takeUntil(this.ngUnsub)).subscribe(() => {
      this.getFaqs();
      this.hideForm();
    });
  }

  setDisplay() {
    this.displayFaqs = this.faqs.filter(
      s => s.question.toLowerCase().includes(this.searchText.toLowerCase())
        || s.answer.toLowerCase().includes(this.searchText.toLowerCase())
        || this.faqCatNameMapping[s.faqCatId].toLowerCase().includes(this.searchText.toLowerCase())
        || s.recordStatus === this.searchText,
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
