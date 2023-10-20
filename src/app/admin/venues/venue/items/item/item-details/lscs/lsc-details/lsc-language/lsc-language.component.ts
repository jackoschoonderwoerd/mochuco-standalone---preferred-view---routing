import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import * as fromRoot from 'src/app/app.reducer'
import { Store } from '@ngrx/store';
import { DocumentData } from '@angular/fire/firestore';
import { Observable, Subscription, take } from 'rxjs';
import { LscsService } from '../../lscs.service';
import { MatSelectModule } from '@angular/material/select';
import { UiService } from 'src/app/admin/shared/ui.service';
import { FirebaseError } from '@angular/fire/app';
import * as ADMIN from 'src/app/admin/store/admin.actions';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-lsc-language',
    standalone: true,
    imports: [CommonModule, MatSelectModule, ReactiveFormsModule],
    templateUrl: './lsc-language.component.html',
    styleUrls: ['./lsc-language.component.scss']
})
export class LscLanguageComponent implements OnInit {
    form: FormGroup
    selectedVenue: Venue;
    selectedItem: Item;
    selectedLsc: LSC;
    lsc$: Observable<DocumentData>
    editmode: boolean = false;

    @Output() editmodeChanged = new EventEmitter<boolean>
    languagesSubscription: Subscription;
    languages: string[]
    availableLanguages: string[] = []


    constructor(
        private store: Store<fromRoot.State>,
        private lscsService: LscsService,
        private uiService: UiService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.initForm()
        this.languages = this.lscsService.getLanguages();
        this.getSelectedVenue()
            .then(() => {
                this.getSelectedItem()
            })
            .then(() => {
                this.excludeUsedLanguages();
                this.getSelectedLsc();
            })
    }

    getSelectedVenue() {
        const promise = new Promise((res, rej) => {
            this.store.select(fromRoot.getSelectedVenue).pipe(take(1)).subscribe((selectedVenue: Venue) => {
                if (selectedVenue) {
                    res(this.selectedVenue = selectedVenue)
                }
            })
        })
        return promise
    }
    getSelectedItem() {
        const promise = new Promise((res, rej) => {
            this.store.select(fromRoot.getSelectedItem).pipe(take(1)).subscribe((selectedItem: Item) => {
                if (selectedItem) {
                    res(this.selectedItem = selectedItem)
                }
            })
        })
        return promise
    }
    getSelectedLsc() {
        this.lsc$ = this.store.select(fromRoot.getSelectedLSC)
        this.store.select(fromRoot.getSelectedLSC).pipe(take(1)).subscribe((selectedLsc: LSC) => {
            if (selectedLsc) {
                this.editmode = true;
                this.selectedLsc = selectedLsc
            }
        })
    }

    initForm() {
        this.form = this.fb.group({
            selectLanguage: new FormControl('null', [Validators.required])
        })
    }
    excludeUsedLanguages() {
        this.lscsService.getLscs(this.selectedVenue.id, this.selectedItem.id)
            .subscribe((lscs: LSC[]) => {
                let occupiedLanguges: string[] = []
                lscs.forEach((lsc: LSC) => {
                    occupiedLanguges.push(lsc.language);
                })
                console.log(occupiedLanguges)
                this.languages.forEach((language: string) => {
                    if (!occupiedLanguges.includes(language)) {
                        this.availableLanguages.push(language)
                        console.log(this.availableLanguages);
                    }
                })
            })
    }


    onLanguageSelected(e) {
        const lsc: LSC = {
            language: e
        }
        this.lscsService.addLsc(this.selectedVenue.id, this.selectedItem.id, lsc)
            .then((res: any) => {
                this.uiService.openSnackbar('lsc added to item');
                this.selectedLsc = lsc;
                this.editmode = true;
                this.store.dispatch(new ADMIN.SetSelectedLSC(lsc))
                this.editmodeChanged.emit(true)
            })
            .catch((err: FirebaseError) => {
                this.uiService.openSnackbar(`failed to add lsc to item; ${err.message}`)
            })
    }

}
