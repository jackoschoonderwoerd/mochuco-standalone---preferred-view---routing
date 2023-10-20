import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { SetSelectedLSC } from '../../../../../../../../store/admin.actions';
import * as ADMIN from 'src/app/admin/store/admin.actions';
import * as LSCACTIONS from '../../store/lsc.actions'
import { LscsService } from '../../lscs.service';
import { UiService } from 'src/app/admin/shared/ui.service';
import { FirebaseError } from '@angular/fire/app';
import { MatButtonModule } from '@angular/material/button';
import { DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NgxEditorModule } from 'ngx-editor';
import { Editor, Toolbar, toHTML } from 'ngx-editor';
import { schema } from 'ngx-editor/schema';

@Component({
    selector: 'app-lsc-description',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        ReactiveFormsModule,
        NgxEditorModule
    ],
    templateUrl: './lsc-description.component.html',
    styleUrls: ['./lsc-description.component.scss']
})
export class LscDescriptionComponent implements OnInit {

    selectedVenue: Venue;
    selectedItem: Item;
    selectedLsc: LSC;
    lsc$: Observable<DocumentData>
    isAdmin$: Observable<boolean>

    descriptionAltered: boolean;
    html = '';
    editor: Editor;
    disabled: boolean = false;
    editorContent: any = ''

    form = new FormGroup({
        editorContent: new FormControl(null, [Validators.required])
    })

    toolbar: Toolbar = [
        [{ heading: ['h4'] },]
    ];


    constructor(
        private fb: FormBuilder,
        private store: Store<fromRoot.State>,
        private lscsService: LscsService,
        private uiService: UiService
    ) {

    }

    ngOnInit(): void {
        this.isAdmin$ = this.store.select(fromRoot.getIsAdmin);
        this.lsc$ = this.store.select(fromRoot.getSelectedLSC)
        this.getSelectedVenue();
        this.getSelectedItem();
        this.getSelectedLsc();
        this.editor = new Editor();
    }

    onDescriptionAltered() {
        this.descriptionAltered = true;
    }


    onSubmitDescriptionInput(): void {
        console.log(this.form.value.editorContent);
        let rawContent = this.form.value.editorContent;
        // const htmlFromNgxEditor = toHTML(rawContent);
        // console.log(htmlFromNgxEditor)

        const description = rawContent
        // const description = rawContent.slice(0, -1)
        // const description = rawContent.slice(1)
        // const description = this.form.value.editorContent;
        this.lscsService.updateLscDescription(
            this.selectedVenue.id,
            this.selectedItem.id,
            this.selectedLsc.language,
            // rawContent,
            rawContent
        )
            .then((res: any) => {
                this.uiService.openSnackbar('lsc description updated')
                const updatedLsc: LSC = {
                    ...this.selectedLsc,
                    description: rawContent
                    // description: rawContent
                }
                this.descriptionAltered = false;
                this.store.dispatch(new ADMIN.SetSelectedLSC(updatedLsc));
            })
            .catch((err: FirebaseError) => {
                this.uiService.openSnackbar(`failed to update lsc description; ${err.message}`)

            })
    }

    private getSelectedVenue(): void {
        this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
            if (selectedVenue) {
                this.selectedVenue = selectedVenue
            }
        })
    }
    private getSelectedItem(): void {
        this.store.select(fromRoot.getSelectedItem).subscribe((selectedItem: Item) => {
            if (selectedItem) {
                this.selectedItem = selectedItem
            }
        })
    }
    private getSelectedLsc(): void {
        this.store.select(fromRoot.getSelectedLSC).subscribe((selectedLsc: LSC) => {
            if (selectedLsc) {
                this.selectedLsc = { ...selectedLsc }
                this.patchForm();
            }
        })
    }
    private patchForm(): void {
        this.form.patchValue({
            editorContent: this.selectedLsc.description
        })
    }

    ngOnDestroy(): void {
        this.editor.destroy()
    }

}
