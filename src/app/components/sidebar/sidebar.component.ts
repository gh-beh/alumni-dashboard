import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {User} from '../../models/user';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    // { path: '/admin/dashboard', title: 'Dashboard',  icon: 'computer', class: '' },
    { path: '/admin/discussion-board', title: 'Discussion Board',  icon: 'forum', class: '' },
    { path: '/admin/member-listing', title: 'Alumni Listing',  icon: 'person', class: '' },
    { path: '/admin/event-activities', title: 'Event & Activities',  icon: 'account_balance', class: '' },
    { path: '/admin/loyalty-rewards', title: 'Loyalty & Rewards',  icon: 'redeem', class: '' },
    { path: '/admin/merchant', title: 'Merchants',  icon: 'storefront', class: '' },
    { path: '/admin/notifications', title: 'Notifications',  icon: 'notifications', class: '' },
];

export const FAQ_ITEMS: RouteInfo[] = [
    { path: '/admin/faq', title: 'Questions',  icon: 'question_answer', class: '' },
    { path: '/admin/faq-categories', title: 'Categories',  icon: 'format_list_bulleted', class: '' },
];

export const ADMIN_ROUTES: RouteInfo[] = [
    { path: '/admin/manage', title: 'Admin Management',  icon: 'manage_accounts', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[];
  faqItems: RouteInfo[];
  adminItems: RouteInfo[];
  user: User;
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.faqItems = FAQ_ITEMS.filter(item => item);
    this.adminItems = ADMIN_ROUTES.filter(item => item);
    this.user = this.authenticationService.currentUserValue;
  }
  isMobileMenu() {
      return $(window).width() <= 991;
  };
}
