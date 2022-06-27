import {Component, OnDestroy, OnInit} from '@angular/core';
import {Alumni, MOCK_MEMBERS, NULL_MEMBER} from '../models/alumni';
import {AlumniService} from '../services/alumni.service';
import {Subject} from 'rxjs';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {take, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './alumni.component.html',
  styleUrls: ['./alumni.component.css']
})
export class AlumniComponent implements OnInit, OnDestroy {
  createAlumni: boolean;
  alumniForm: FormGroup;
  failToLoad = false;
  displayAlumni = [];
  alumnis: Alumni[];
  mockAlumni: Alumni[];
  showTable: boolean;
  showForm: boolean;
  formAlumni: Alumni;
  emptyAlumni: Alumni;
  submitted = false;
  searchText = '';
  pageIndex = 0;
  pageSize = 10;
  lowValue = 0;
  highValue = 10;
  pageSizeOptions = [5, 10, 15, 20];

  private ngUnsub: Subject<any> = new Subject();

  constructor(private memberService: AlumniService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getAlumnis();
    this.showTable = true;
    this.showForm = false;
    this.emptyAlumni = NULL_MEMBER;
    this.formAlumni = this.emptyAlumni;
    this.alumniForm = this.formBuilder.group(
        {
          name: ['', Validators.required],
          identificationCard: ['', Validators.required],
          studentId: ['', Validators.required],
          personalEmail: ['', [Validators.required, Validators.email]],
          studentHandphone: ['', [Validators.required, Validators.pattern(/^[0-9-+)(]+$/)]],
          studentTelephoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9-+)(]+$/)]],
          graduatingCampus: ['', Validators.required],
          yearOfGraduation: ['', Validators.required, Validators.min(0)],
          graduatingProgramme: ['', Validators.required],
          graduatedProgrammeName: ['', Validators.required],
          levelOfStudy: ['', Validators.required],
        }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.alumniForm.controls;
  }

  getAlumnis() {
    this.memberService.getMembers().pipe(takeUntil(this.ngUnsub))
      .subscribe(
        res => {
          this.alumnis = res;
          this.setDisplay();
        });
  }

  addMember() {
    this.createAlumni = true;
    this.displayForm(this.emptyAlumni);
  }

  editAlumni(alumni: Alumni) {
    this.createAlumni = false;
    this.displayForm(alumni);
  }

  removeAlumni(id: number) {
    this.memberService.deleteMember(id).pipe(takeUntil(this.ngUnsub)).subscribe(() =>
        this.getAlumnis());
  }

  displayForm(alumni: Alumni) {
    this.formAlumni = {...alumni};
    this.showTable = false;
    this.showForm = true;
    this.submitted = false;
  }

  hideForm() {
    this.showTable = true;
    this.showForm = false;
    this.formAlumni = {...this.emptyAlumni};
  }

  submitForm() {
    // POST here
    this.submitted = true;
    const submitAlumni = {...this.formAlumni};
    const response = this.createAlumni ? this.memberService.addMember(submitAlumni) : this.memberService.updateMember(submitAlumni);
    response.pipe(takeUntil(this.ngUnsub)).subscribe(() => {
      this.getAlumnis();
      this.hideForm();
    });
  }

  setDisplay() {
    this.displayAlumni = this.alumnis.filter(
      s => s.name.toLowerCase().includes(this.searchText.toLowerCase())
        || s.personalEmail.toLowerCase().includes(this.searchText.toLowerCase())
        || s.graduatingCampus.toLowerCase().includes(this.searchText.toLowerCase())
        || s.levelOfStudy.toLowerCase().includes(this.searchText.toLowerCase())
        || s.studentId.toLowerCase().includes(this.searchText.toLowerCase())
        || s.studentHandphone.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

  resetSearch() {
    this.searchText = '';
    this.setDisplay();
  }

  onClearSearch() {
    if (this.searchText === '') { this.setDisplay(); }
  }

  getPaginatorData(event){
    console.log(event);
    if (event.pageIndex === this.pageIndex + 1){
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue =  this.highValue + this.pageSize;
    } else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue =  this.highValue - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
  }

  ngOnDestroy(): any {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }
}
