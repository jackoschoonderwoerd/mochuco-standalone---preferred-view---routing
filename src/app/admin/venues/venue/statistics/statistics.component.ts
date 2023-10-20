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
export class StatisticsComponent {

    displayedColumns: string[] = ['id', 'itemName', 'timestamp'];
    dataSource: MatTableDataSource<VisitData>;
    venue: Venue;
    @ViewChild(MatSort) sort: MatSort;




}
