import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer';
import * as ADMIN from 'src/app/admin/store/admin.actions'
import { Observable, first, from } from 'rxjs';
import { ItemsService } from '../../../items.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/admin/shared/confirm/confirm.component';
import { SELECTED_ITEM } from '../../../../../../store/admin.actions';
import { UiService } from 'src/app/admin/shared/ui.service';
import { FirebaseError } from '@angular/fire/app';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { LscsService } from './lscs.service';

@Component({
    selector: 'app-lscs',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './lscs.component.html',
    styleUrls: ['./lscs.component.scss']
})
export class LscsComponent implements OnInit {

    selectedVenue: Venue;
    selectedItem: Item;
    lscs$: Observable<any[]>

    constructor(
        private router: Router,
        private store: Store,
        private itemsService: ItemsService,
        private dialog: MatDialog,
        private uiService: UiService,
        private LscsService: LscsService) { }

    ngOnInit(): void {
        console.log('oninit languages.component')
        let selectedVenueX: Venue = null;
        let selectedItemX: Item = null;



        this.getAdminSelectedVenue()
            .then((selectedVenue: Venue) => {
                selectedVenueX = selectedVenue
                return this.getSelectedItem()
            })
            .then((selectedItem: Item) => {
                console.log(selectedItem.name);
                selectedItemX = selectedItem
            })
            .then(() => {
                console.log(selectedVenueX.id);
                console.log(selectedItemX.id);
                this.lscs$ = this.LscsService.getLscs(selectedVenueX.id, selectedItemX.id)

            })
            .catch(err => console.log(err))

    }

    getVisitorSelectedVenue() {

    }

    getAdminSelectedVenue() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getSelectedVenue).subscribe((adminSelectedVenue: Venue) => {
                if (adminSelectedVenue) {
                    resolve(adminSelectedVenue)
                } else {
                    reject('no adminSelectedVenue in store')
                }
            })
        })
        return promise
    }

    getSelectedItem() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getSelectedItem).subscribe((selectedItem: Item) => {
                if (selectedItem) {
                    console.log(selectedItem.id);
                    resolve(selectedItem)
                } else {
                    reject('item not available');
                }
            })
        })
        return promise
    }

    onAddLanguage() {
        this.router.navigateByUrl('/admin/lsc-details');
    }
    onDetails(lsc: LSC) {
        console.log('onDetails()');
        this.store.dispatch(new ADMIN.SetSelectedLSC(lsc))
        this.router.navigateByUrl('/admin/lsc-details')
    }
    onDelete(language: string) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'Are you sure? This will permanently delete this language.'
            }
        })
        dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
                this.LscsService.deleteLscFromItem(
                    this.selectedVenue.id,
                    this.selectedItem.id,
                    language
                )
                    .then((res: any) => {
                        this.uiService.openSnackbar('language deleted')
                    })
                    .catch((err: FirebaseError) => {
                        this.uiService.openSnackbar(`failed to delete language; ${err.message}`);
                    });
            }
        })
    }
    onCancel() {

    }
}
