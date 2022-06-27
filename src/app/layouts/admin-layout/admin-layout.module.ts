import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRouter} from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { AlumniComponent } from '../../alumni/alumni.component';
import { EventsComponent } from '../../events/events.component';
import { RewardsComponent } from '../../rewards/rewards.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {ImagePreloadDirective} from './directives/img-preload.directive';
import {FaqComponent} from '../../faq/faq.component';
import {FaqCategoryComponent} from '../../faq-categories/faq-categories.component';
import {AdminLayoutComponent} from './admin-layout.component';
import {ComponentsModule} from '../../components/components.module';
import {NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {MatPaginatorModule} from '@angular/material/paginator';
import {DiscussionBoardComponent} from '../../discussion-board/discussion-board.component';
import {EventsService} from '../../services/events.service';
import {AlumniService} from '../../services/alumni.service';
import {FaqService} from '../../services/faq.service';
import {FaqCatService} from '../../services/faq-cat.service';
import {ImgurService} from '../../services/imgur.service';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        AdminLayoutRouter,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatIconModule,
        MatNativeDateModule,
        MatPaginatorModule,
        NgbTimepickerModule,
    ],
    declarations: [
        AdminLayoutComponent,
        DashboardComponent,
        DiscussionBoardComponent,
        AlumniComponent,
        FaqComponent,
        FaqCategoryComponent,
        EventsComponent,
        RewardsComponent,
        MapsComponent,
        NotificationsComponent,
        ImagePreloadDirective,
    ]
})

export class AdminLayoutModule {}
