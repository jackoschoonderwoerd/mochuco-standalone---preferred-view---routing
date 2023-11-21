import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { LscDescriptionComponent } from './lsc-description/lsc-description.component';
import { LscLanguageComponent } from './lsc-language/lsc-language.component';
import { LscNameComponent } from './lsc-name/lsc-name.component';
import { LscPreviewComponent } from './lsc-preview/lsc-preview.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, take } from 'rxjs';
import { Router } from '@angular/router';
import { SelectAudioComponent } from './lsc-audio/lsc-audio.component';
import { Store } from '@ngrx/store';
import * as ADMIN from 'src/app/admin/store/admin.actions';
import * as fromRoot from 'src/app/app.reducer'


@Component({
    selector: 'app-lsc-details',
    standalone: true,
    imports: [
        CommonModule,
        MatSelectModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        LscNameComponent,
        LscLanguageComponent,
        LscPreviewComponent,
        LscDescriptionComponent,
        SelectAudioComponent,

    ],
    templateUrl: './lsc-details.component.html',
    styleUrls: ['./lsc-details.component.scss']
})
export class LscDetailsComponent implements OnInit {

    editmode: boolean = false
    lsc$: Observable<DocumentData>
    nameAndDescriptionChanged: boolean = false;
    item$: Observable<DocumentData>

    constructor(
        private store: Store<fromRoot.State>,
        private router: Router,
        private dialog: MatDialog,
        private firestoreService: FirestoreService
    ) { }

    ngOnInit(): void {

        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            this.store.select(fromRoot.getAdminItemId).subscribe((itemId: string) => {
                if (itemId) {
                    const pathToItem = `venues/${venueId}/items/${itemId}`
                    this.item$ = this.firestoreService.getDocument(pathToItem)
                    this.store.select(fromRoot.getAdminLanguage).subscribe((language: string) => {
                        const pathToLsc = `venues/${venueId}/items/${itemId}/languages/${language}`
                        this.lsc$ = this.firestoreService.getDocument(pathToLsc);
                        this.lsc$.subscribe((lsc: LSC) => {
                            if (lsc) {
                                this.editmode = true
                            }
                        })
                    })
                }
            })
        })
    }

    onEditDescription() {
        this.dialog.open(LscDescriptionComponent);
    }

    onBackToItemDetails() {
        this.router.navigateByUrl('/admin/item-details');
        this.store.dispatch(new ADMIN.SetAdminLanguage(null));
    }
}
