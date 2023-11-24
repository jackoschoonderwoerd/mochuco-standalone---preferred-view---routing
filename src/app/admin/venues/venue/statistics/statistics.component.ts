import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from './statistics.service';
import { VisitData } from 'src/app/admin/shared/models/visit-data';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { ItemsListComponent } from './items-list/items-list.component';
import { DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { Router } from '@angular/router';



@Component({
    selector: 'app-statistics',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSortModule,
        ItemsListComponent
    ],
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

    venue$: Observable<DocumentData>

    constructor(
        private store: Store,
        private firestoreService: FirestoreService,
        private router: Router) { }

    ngOnInit(): void {
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            const pathToVenue = `venues/${venueId}`
            this.venue$ = this.firestoreService.getDocument(pathToVenue)
        })
    }
    onBackToVenueDetails() {
        this.router.navigateByUrl('admin/venue')
    }


}
