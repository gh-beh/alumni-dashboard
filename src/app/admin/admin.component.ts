import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {FormBuilder, Validators, FormGroup, AbstractControl} from '@angular/forms';
import {Admin, NULL_ADMIN} from '../models/user';
import {AdminService} from '../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  adminForm: FormGroup;
  displayAdmins: Admin[] = [];
  admins: Admin[];
  showTable: boolean;
  showForm: boolean;
  formAdmin: Admin;
  emptyAdmin: Admin;
  createAdmin: boolean;
  submitted: boolean;
  searchText = '';

  private ngUnsub: Subject<any> = new Subject();

  constructor(private adminService: AdminService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getAdmins();
    this.showTable = true;
    this.showForm = false;
    this.emptyAdmin = NULL_ADMIN;
    this.formAdmin = this.emptyAdmin;
    this.adminForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required],
      },
    )
  }

  getAdmins() {
    this.adminService.getAdmins().pipe(takeUntil(this.ngUnsub))
        .subscribe(res => {
            this.admins = res;
            this.setDisplay();
        });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.adminForm.controls;
  }

  addAdmin() {
    this.createAdmin = true;
    this.displayForm(this.emptyAdmin);
  }

  editAdmin(admin: Admin) {
    this.createAdmin = false;
    this.displayForm(admin);
    this.f.username.setValue(admin.username);
  }

  displayForm(admin: Admin) {
    this.formAdmin = {...admin};
    this.showTable = false;
    this.submitted = false;
    this.showForm = true;
  }

  hideForm() {
    this.showTable = true;
    this.showForm = false;
    this.formAdmin = {...this.emptyAdmin};
  }

  submitForm() {
    if (this.adminForm.invalid) { return; }
    this.submitted = true;
    // POST here
    const submitFaq = {...this.formAdmin};
    const response = this.createAdmin
        ? this.adminService.addAdmin(submitFaq)
        : this.adminService.resetPassword(submitFaq);
    response.pipe(takeUntil(this.ngUnsub)).subscribe(() => {
      this.getAdmins();
      this.hideForm();
    });
  }

  setDisplay() {
    this.displayAdmins = this.admins.filter(
      s => s.username.toLowerCase().includes(this.searchText.toLowerCase()),
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
