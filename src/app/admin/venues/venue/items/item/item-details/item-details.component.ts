import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fromRoot from './../../../../../../app.reducer'
import * as ADMIN from './../../../../../store/admin.actions'
import { Store } from '@ngrx/store';
import { Item } from 'src/app/admin/shared/models/item.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { ItemsService } from '../../items.service';
import { UiService } from 'src/app/admin/shared/ui.service';
import { getSelectedItem } from '../../../../../store/admin.reducer';
import { FirestoreError } from '@angular/fire/firestore';
import { LscsComponent } from './lscs/lscs.component';
import { Observable, from } from 'rxjs';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Router } from '@angular/router';
import { ItemNameComponent } from './item-name/item-name.component';
import { ItemImageComponent } from './item-image/item-image.component';
import { ItemQrComponent } from './item-qr/item-qr.component';
// import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ItemQrLocalComponent } from './item-qr-local/item-qr-local.component';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { User as FirebaseUser } from "@angular/fire/auth";
import { ItemCoordinatesComponent } from './item-coordinates/item-coordinates.component';
import { ItemIsMainPageComponent } from './item-is-main-page/item-is-main-page.component';


@Component({
    selector: 'app-item-details',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        LscsComponent,
        ItemNameComponent,
        ItemImageComponent,
        ItemQrComponent,
        ItemQrLocalComponent,
        ItemCoordinatesComponent,
        ItemIsMainPageComponent

    ],
    // providers: [{ provide: NgxQRCodeModule }],
    templateUrl: './item-details.component.html',
    styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {


    selectedVenue: Venue;
    selectedItem: Item;
    selectedLSC: LSC;
    editmode: boolean = false
    lscs$: Observable<any[]>;
    isAdmin: boolean = false


    constructor(
        private store: Store<fromRoot.State>,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private itemsService: ItemsService,
        private uiService: UiService,
        private router: Router,
        private afAuth: Auth,

    ) { }

    ngOnInit(): void {

        this.getSelectedItemFromStore();
        this.getSelectedVenueFromStore();
        onAuthStateChanged(this.afAuth, (user: FirebaseUser) => {
            if (user) {
                console.log(user.uid)
                if (user.uid === 'DhwbsQYD4OVm2j7d5ZzZGiGoHXJ2') {
                    this.isAdmin = true;
                }
            } else {

            }
        })

    }


    getSelectedItemFromStore() {
        this.store.select(fromRoot.getSelectedItem).subscribe((selectedItem: Item) => {
            if (selectedItem) {
                this.editmode = true;
                this.selectedItem = { ...selectedItem };
            }
        })
    }

    getSelectedVenueFromStore() {
        this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
            if (selectedVenue) {
                this.selectedVenue = selectedVenue
            }
        })
    }

    onBackToVenueDetails() {
        this.store.dispatch(new ADMIN.SetSelectedItem(null));
        this.router.navigateByUrl('/admin/venue')
    }
}
