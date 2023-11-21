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
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';

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
    venueId: string;
    itemId: string;
    language: string


    constructor(
        private store: Store<fromRoot.State>,
        private lscsService: LscsService,
        private uiService: UiService,
        private fb: FormBuilder,
        private firestoreService: FirestoreService,


    ) { }

    ngOnInit(): void {
        this.initForm();
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                this.venueId = venueId
                this.store.select(fromRoot.getAdminItemId).subscribe((itemId: string) => {
                    if (itemId) {
                        this.itemId = itemId;
                        this.store.select(fromRoot.getAdminLanguage).subscribe((language: string) => {
                            if (language) {
                                this.language = language
                                this.editmode = true;
                                this.patchForm(language)
                            } else {
                                this.editmode = false;
                                this.getAvailableLanguages(venueId, itemId)
                            }
                        })
                    }
                })
            }
        })

    }


    private initForm() {
        this.form = this.fb.group({
            selectLanguage: new FormControl('null', [Validators.required])
        })
    }
    private patchForm(language: string) {
        this.form.patchValue({
            selectLanguage: language
        })
    }
    private getAvailableLanguages(venueId: string, itemId: string) {
        this.lscsService.getAvailableLanguages(venueId, itemId).then((availableLanguages: string[]) => {
            this.availableLanguages = availableLanguages
        })
    }


    onLanguageSelected(language: string) {
        const lsc: LSC = {
            language
        }
        console.log(lsc);
        const path = `venues/${this.venueId}/items/${this.itemId}/languages/${lsc.language}`
        this.firestoreService.setDoc(path, lsc)
            .then((res: any) => {
                console.log('lsc added')
                this.editmode = false;
                this.store.dispatch(new ADMIN.SetAdminLanguage(language))
            })
            .catch((err: FirebaseError) => {
                console.log(`failed to add lsc; ${err.message}`)
            })
        // this.lscsService.addLsc(this.selectedVenue.id, this.selectedItem.id, lsc)
        //     .then((res: any) => {
        //         this.uiService.openSnackbar('lsc added to item');
        //         this.selectedLsc = lsc;
        //         this.editmode = true;
        //         this.store.dispatch(new ADMIN.SetSelectedLSC(lsc))
        //         this.editmodeChanged.emit(true)
        //     })
        //     .catch((err: FirebaseError) => {
        //         this.uiService.openSnackbar(`failed to add lsc to item; ${err.message}`)
        //     })
    }

}
