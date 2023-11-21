import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/admin/shared/confirm/confirm.component';
import { FirebaseError } from '@angular/fire/app';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { Item } from 'src/app/admin/shared/models/item.model';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Observable, take } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { WarningComponent } from 'src/app/admin/shared/warning/warning.component';
import * as ADMIN from 'src/app/admin/store/admin.actions'
import * as fromRoot from 'src/app/app.reducer';


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

    lscs$: Observable<any[]>;
    venueId: string;
    itemId: string;

    constructor(
        private router: Router,
        private store: Store,
        private dialog: MatDialog,
        private firesStoreService: FirestoreService) { }

    ngOnInit(): void {
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                this.venueId = venueId;
                this.store.select(fromRoot.getAdminItemId).subscribe((itemId: string) => {
                    if (itemId) {
                        this.itemId = itemId
                        const pathTolanguages = `venues/${venueId}/items/${itemId}/languages`;
                        this.lscs$ = this.firesStoreService.getCollection(pathTolanguages)
                    }
                })
            }
        })
    }

    onAddLanguage() {
        this.router.navigateByUrl('/admin/lsc-details');
        this.store.dispatch(new ADMIN.SetAdminLanguage(null));
    }
    onDetails(lsc: LSC) {
        this.store.dispatch(new ADMIN.SetAdminLanguage(lsc.language));
        this.router.navigateByUrl('/admin/lsc-details')
    }

    onDeleteLsc(language: string) {
        const lscPath = `venues/${this.venueId}/items/${this.itemId}/languages/${language}`;

        this.firesStoreService.getDocument(lscPath).pipe(take(1)).subscribe((lsc: LSC) => {
            if (lsc.audioUrl) {
                this.warnLanguageNotEmpty()
            } else {
                const dialogRef = this.dialog.open(ConfirmComponent, {
                    data: {
                        message: `Are you sure? This will permanently delete the language`
                    }
                })
                dialogRef.afterClosed().subscribe((res: boolean) => {
                    if (res) {
                        this.firesStoreService.deleteDocument(lscPath)
                            .then((res: any) => {
                                console.log('lsc deleted');
                                this.store.dispatch(new ADMIN.SetAdminLanguage(null))
                            })
                            .catch((err: FirebaseError) => {
                                console.error(`failed to delete language; ${err.message}`)
                            })
                    }
                })
            }
        })
    }

    private warnLanguageNotEmpty() {
        this.dialog.open(WarningComponent, {
            data: {
                message: 'This language is not empty, delete the audio file first'
            }
        })
    }
}
