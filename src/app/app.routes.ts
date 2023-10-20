import { Routes } from '@angular/router';
import { ScannerComponent } from './visitor/scanner/scanner.component';
// import { HomeComponent } from './visitor/home/home.component.tsXXX';

import { VenuesComponent } from './admin/venues/venues.component';
import { AddVenueComponent } from './admin/venues/venue/venue.component';
import { ItemComponent } from './admin/venues/venue/items/item/item.component';
import { ItemsComponent } from './admin/venues/venue/items/items.component';
import { LoginComponent } from './auth/login/login.component';
import { UserDataComponent } from './admin/user-data/user-data.component';
import { ItemDetailsComponent } from './admin/venues/venue/items/item/item-details/item-details.component';
import { LscDetailsComponent } from './admin/venues/venue/items/item/item-details/lscs/lsc-details/lsc-details.component';
// import { LscDetailsComponent } from './admin/venues/venue/items/item/item-details/lscs/lsc-details/language-details.component';
import { ScanResultComponent } from './visitor/scan-result/scan-result.component';
import { TestsComponent } from './admin/shared/tests/tests.component';
// import { MainPageComponent } from './visitor/main-pageXXX/main-page.component.tsXXX';
import { VisitorErrorPageComponent } from './visitor/visitor-error-page/visitor-error-page.component';
import { StatisticsComponent } from './admin/venues/venue/statistics/statistics.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    // {
    //     path: 'home', component: HomeComponent
    // },
    {
        path: 'scanner', component: ScannerComponent
    },
    {
        path: 'admin', canActivate: [authGuard],
        loadChildren: () => import('./admin/admin.routes')
            .then(r => r.ADMIN_ROUTES)
    },
    // {
    //     path: 'venues', component: VenuesComponent
    // },
    // {
    //     path: 'venue', component: AddVenueComponent
    // },
    // {
    //     path: 'items', component: ItemsComponent
    // },
    // {
    //     path: 'item', component: ItemComponent
    // },
    // {
    //     path: 'login', component: LoginComponent
    // },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes')
            .then(r => r.AUTH_ROUTES)
    },
    // {
    //     path: 'user-data', component: UserDataComponent
    // },
    // {
    //     path: 'item-details', component: ItemDetailsComponent
    // },
    // {
    //     path: 'lsc-details', component: LscDetailsComponent
    // },
    {
        path: 'scan-result', component: ScanResultComponent
    },
    {
        path: 'tests', component: TestsComponent
    },
    // {
    //     path: 'main-page', component: MainPageComponent
    // },
    {
        path: 'visitor-error', component: VisitorErrorPageComponent
    },
    {
        path: 'statistics', component: StatisticsComponent
    },
    {
        path: '**', component: ScanResultComponent
    },

];
