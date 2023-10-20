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

    selectedVenue: Venue;
    selectedItem: Item;
    selectedLanguage: string;
    selectedLsc: LSC;
    lsc$: Observable<DocumentData>;
    form: FormGroup;
    editmode: boolean = false;
    nameAltered: boolean = false;


    constructor(
        private store: Store<fromRoot.State>,
        private fb: FormBuilder,
        private lscsService: LscsService,
        private uiService: UiService
    ) { }

    ngOnInit(): void {
        this.lsc$ = this.store.select(fromRoot.getSelectedLSC);
        this.initForm()
        this.getSelectedVenue();
        this.getSelectedItem();
        this.getSelectedLsc();
    }

    onKeyUp(e) {
        this.nameAltered = true;
    }
    onUpdateName() {
        const updatedName = this.form.value.name
        this.lscsService.updateLscName(
            this.selectedVenue.id,
            this.selectedItem.id,
            this.selectedLsc.language,
            this.form.value.name)
            .then((res: any) => {
                const updatedLsc: LSC = {
                    ...this.selectedLsc,
                    name: updatedName
                }
                console.log(updatedLsc);
                this.nameAltered = false;
                this.uiService.openSnackbar('lsc name updated')
                this.store.dispatch(new ADMIN.SetSelectedLSC(updatedLsc));

            })
            .catch((err: FirebaseError) => {
                this.uiService.openSnackbar(`failed to update lsc name; ${err.message}`);
            })
    }

    private getSelectedVenue() {
        this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
            if (selectedVenue) {
                this.selectedVenue = selectedVenue
            } else {

            }
        })
    }
    private getSelectedItem() {
        this.store.select(fromRoot.getSelectedItem).subscribe((selectedItem: Item) => {
            if (selectedItem) {
                this.selectedItem = selectedItem
            }
        })
    }
    private getSelectedLsc() {
        this.store.select(fromRoot.getSelectedLSC).subscribe((selectedLsc: LSC) => {
            if (selectedLsc) {
                this.selectedLsc = { ...selectedLsc }
                this.patchForm();
            }
        })
    }

    private patchForm() {
        this.form.patchValue({
            name: this.selectedLsc.name
        })
    }

    private initForm() {
        this.form = this.fb.group({
            name: new FormControl(null, [Validators.required])
        })
    }

}
