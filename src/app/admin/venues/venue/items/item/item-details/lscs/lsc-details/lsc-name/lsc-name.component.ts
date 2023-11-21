import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { DocumentData } from '@angular/fire/firestore';
import { Observable, take } from 'rxjs';
import * as fromRoot from 'src/app/app.reducer'
import { Store } from '@ngrx/store';
// import * as LSCACTIONS from './../../store/languages.actions'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import * as ADMIN from 'src/app/admin/store/admin.actions';
import * as LSCACTIONS from '../../store/lsc.actions'
import { LscsService } from '../../lscs.service';
import { UiService } from 'src/app/admin/shared/ui.service';
import { FirebaseError } from '@angular/fire/app';
import { StoreService } from 'src/app/admin/admin-services/store.service';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';

@Component({
    selector: 'app-lsc-name',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    templateUrl: './lsc-name.component.html',
    styleUrls: ['./lsc-name.component.scss']
})
export class LscNameComponent implements OnInit {


    lsc$: Observable<DocumentData>;
    form: FormGroup;
    editmode: boolean = false;
    nameAltered: boolean = false;
    venueId: string;
    itemId: string;
    language: string;
    pathToLsc: string


    constructor(
        private store: Store<fromRoot.State>,
        private fb: FormBuilder,
        private uiService: UiService,
        private firestoreService: FirestoreService,
        private lscsService: LscsService
    ) { }

    ngOnInit(): void {
        this.initForm()
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            if (venueId) {
                this.venueId = venueId;
                this.store.select(fromRoot.getAdminItemId).subscribe((itemId: string) => {
                    if (itemId) {
                        this.itemId = itemId;
                        this.store.select(fromRoot.getAdminLanguage).subscribe((language: string) => {
                            if (language) {
                                this.editmode = true;
                                this.language = language;
                                this.pathToLsc = `venues/${venueId}/items/${itemId}/languages/${language}`
                                this.firestoreService.getDocument(this.pathToLsc).subscribe((lsc: LSC) => {
                                    if (lsc) {
                                        this.patchForm(lsc.name)
                                    }
                                })
                                this.lsc$ = this.firestoreService.getDocument(this.pathToLsc);
                            } else {
                                this.editmode = false;
                            }
                        })
                    }
                })
            }
        })
    }



    onKeyUp(e) {
        this.nameAltered = true;
    }
    onUpdateName() {
        const name = this.form.value.name
        this.firestoreService.updateDocument(this.pathToLsc, { name })
            .then((res: any) => {
                this.nameAltered = false;
                this.uiService.openSnackbar('lsc name updated')
            })
            .catch((err: FirebaseError) => {
                this.uiService.openSnackbar(`failed to update lsc name; ${err.message}`);
            })
    }

    private patchForm(lscName) {
        this.form.patchValue({
            name: lscName
        })
    }

    private initForm() {
        this.form = this.fb.group({
            name: new FormControl(null, [Validators.required])
        })
    }

}
