import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer';
import * as VISITOR from 'src/app/visitor/store/visitor.actions'
import { Item } from 'src/app/admin/shared/models/item.model';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { LscsService } from 'src/app/admin/venues/venue/items/item/item-details/lscs/lscs.service';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { Observable, first, last, of, take } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { getVisitorSelectedLanguage } from '../../../visitor/store/visitor.reducer';
import { ItemsService } from '../../../admin/venues/venue/items/items.service';


@Component({
    selector: 'app-visitor-select-language',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule
    ],
    templateUrl: './visitor-select-language.component.html',
    styleUrls: ['./visitor-select-language.component.scss']
})
export class VisitorLscLanguageComponent implements OnInit {

    visitorSelectedVenue: Venue;
    visitorSelectedItem: Item;
    // selectableLanguages: string[] = ['jacko']
    selectableLanguages$: Observable<string[]>;
    venueId: string;
    itemId: string;
    lscs: LSC[];
    languages: string[] = []

    constructor(
        private store: Store<fromRoot.State>,
        private lscsService: LscsService,
        private itemsService: ItemsService,
        private dialogRef: MatDialogRef<VisitorLscLanguageComponent>,



    ) { }

    ngOnInit(): void {


        // this.dialogRef.updateSize('100vw', '100vh')
        this.getSelectableLanguages();
    }
    onLanguage(language) {
        this.store.dispatch(new VISITOR.SetVisitorSelectedLanguage(language))
        this.dialogRef.close();
    }


    getSelectableLanguages() {
        // this.store.dispatch(new VISITOR.SetVisitorSelectedLanguage(null))
        this.getVisitorVenueId()
            .then((venueId: string) => {
                if (venueId) {
                    this.venueId = venueId;
                }
            })
            .then(() => {
                this.getVisitorItemId().then((itemId: string) => {
                    if (itemId) {
                        this.itemId = itemId;
                    }
                })
            })
            .then(() => {
                return this.getLscs()
            })
            .then((lscs: LSC[]) => {
                if (lscs) {
                    this.lscs = lscs
                }
            })
            .then(() => {
                console.log(this.venueId, this.itemId, this.lscs);
                return this.extractLanguages()
            })
            .then((languages: string[]) => {

                this.languages = languages
            })

    }

    getVisitorVenueId() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getVisitorVenueId).subscribe((venueId: string) => {
                if (venueId) {
                    resolve(venueId)
                } else {
                    reject('no venueId')
                }
            })
        })
        return promise
    }

    getVisitorItemId() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getVisitorItemId).subscribe((itemId: string) => {
                if (itemId) {
                    resolve(itemId)
                } else {
                    reject('no itemId')
                }
            })
        })
        return promise
    }
    getVisitorLanguage() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getVisitorSelectedLanguage).subscribe((language: string) => {
                if (language) {
                    resolve(language)
                } else {
                    reject('no language')
                }
            })
        })
        return promise
    }
    getLscs() {
        const promise = new Promise((resolve, reject) => {
            this.lscsService.getLscs(this.venueId, this.itemId).subscribe((lscs: LSC[]) => {
                // console.log(lscs)
                if (lscs.length > 1) {

                    resolve(lscs)
                }
            })
        })
        return promise
    }
    extractLanguages() {
        const languages: string[] = [];
        const promise = new Promise((resolve, reject) => {
            this.lscs.forEach((lsc: LSC) => {
                languages.push(lsc.language);
            })
            resolve(languages)
        })
        return promise
    }

}

