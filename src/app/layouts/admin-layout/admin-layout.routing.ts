import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { AlumniComponent } from '../../alumni/alumni.component';
import { EventsComponent } from '../../events/events.component';
import { RewardsComponent } from '../../rewards/rewards.component';
import { AdminComponent } from '../../admin/admin.component';
import { MerchantComponent } from '../../merchant/merchant.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import {FaqComponent} from '../../faq/faq.component';
import {FaqCategoryComponent} from '../../faq-categories/faq-categories.component';
import {AdminLayoutComponent} from './admin-layout.component';
import {AuthGuard} from '../../helpers/auth.guard';
import {AdminGuard} from '../../helpers/admin.guard';
import {DiscussionBoardComponent} from '../../discussion-board/discussion-board.component';

const AdminLayoutRoutes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            // { path: 'dashboard',      component: DashboardComponent },
            { path: 'discussion-board',     component: DiscussionBoardComponent },
            { path: 'member-listing',   component: AlumniComponent },
            { path: 'event-activities',     component: EventsComponent },
            { path: 'faq',     component: FaqComponent },
            { path: 'faq-categories',     component: FaqCategoryComponent },
            { path: 'loyalty-rewards',     component: RewardsComponent },
            { path: 'merchant',        component: MerchantComponent},
            { path: 'notifications',  component: NotificationsComponent },
            { path: 'manage', component: AdminComponent, canActivate: [AdminGuard]}
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(AdminLayoutRoutes)],
    exports: [RouterModule]
})
export class AdminLayoutRouter { }
