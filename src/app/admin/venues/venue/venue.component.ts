import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormGroup,
    FormBuilder,
    FormControl,
    Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Venue } from '../../shared/models/venue.model';
import { MatButtonModule } from '@angular/material/button';
import { VenuesService } from '../venues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from '../../shared/ui.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import * as ADMIN from './../../store/admin.actions'
import { ItemsComponent } from './items/items.component';
import { ItemsService } from './items/items.service';
import { Auth } from '@angular/fire/auth';
import { DocumentData } from '@angular/fire/firestore';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { LogoComponent } from './logo/logo.component';
import { VenueNameComponent } from './venue-name/venue-name.component';
import { VenueQrComponent } from './venue-qr/venue-qr.component';
import { VenueLocalQrComponent } from './venue-local-qr/venue-local-qr.component';
import { FirestoreService } from '../../admin-services/firestore.service';

@Component({
    selector: 'app-venue',
    standalone: true,
    imports: [
        MatFormFieldModule,
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        ItemsComponent,
        MatIconModule,
        LogoComponent,
        VenueNameComponent,
        VenueQrComponent,
        VenueLocalQrComponent
    ],
    templateUrl: './venue.component.html',
    styleUrls: ['./venue.component.scss']
})
export class AddVenueComponent implements OnInit {

    // selectedVenue: Venue;
    form: FormGroup
    editmode: boolean = false;
    items$: Observable<any[]>;
    venue$: Observable<DocumentData>;
    isAdmin$: Observable<boolean>

    constructor(

        private router: Router,
        private store: Store<fromRoot.State>,

    ) { }

    ngOnInit(): void {

        this.isAdmin$ = this.store.select(fromRoot.getIsAdmin)
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                this.editmode = true;
            }
        })
    }


    editmodeChanged(status: boolean) {
        this.editmode = status;
    }


    onBackToVenues() {
        this.store.dispatch(new ADMIN.SetAdminVenueId(null));
        this.router.navigateByUrl('admin/venues');
    }
    onStatistics() {
        // console.log('onStatistics()')
        this.router.navigateByUrl('/admin/statistics')
    }
}
