// https://sibiraj-s.github.io/ngx-editor/en/introduction/

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Editor, Toolbar, toHTML } from 'ngx-editor';
import { FirebaseError } from '@angular/fire/app';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from 'src/app/admin/shared/models/item.model';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { LscsService } from '../../lscs.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxEditorModule, toDoc } from 'ngx-editor';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { StoreService } from 'src/app/admin/admin-services/store.service';
import { UiService } from 'src/app/admin/shared/ui.service';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import * as fromRoot from 'src/app/app.reducer';

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
    pathToLsc: string;

    form = new FormGroup({
        editorContent: new FormControl(null, [Validators.required])
    })

    toolbar: Toolbar = [
        [{ heading: ['h4'] },],
        // ['format_clear']
    ];

    editorConfig = {
        editable: true,
        spellcheck: false,
        height: '10rem',
        minHeight: '100rem',
        placeholder: 'Type something. Test the Editor... ヽ(^。^)丿',
        translate: 'no',
        // toolbar: Toolbar = [
        //     ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
        //     ["fontName", "fontSize", "color"],
        //     ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
        //     ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
        //     ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
        //     ["link", "unlink", "image", "video"]
        // ]
    };


    constructor(

        private store: Store<fromRoot.State>,
        private lscsService: LscsService,
        private uiService: UiService,
        private storeService: StoreService,
        private dialogRef: MatDialogRef<LscDescriptionComponent>,
        private firestoreService: FirestoreService
    ) {

    }

    ngOnInit(): void {
        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            this.store.select(fromRoot.getAdminItemId).subscribe((itemId: string) => {
                this.store.select(fromRoot.getAdminLanguage).subscribe((language: string) => {
                    this.pathToLsc = `venues/${venueId}/items/${itemId}/languages/${language}`
                    this.lsc$ = this.firestoreService.getDocument(this.pathToLsc);
                    this.lsc$.subscribe((lsc: LSC) => {
                        if (lsc) {
                            this.patchForm(lsc.description)
                        }
                    })

                })
            })
        })

        this.editor = new Editor({
            // content: '',
            // plugins: [],
            // schema,
            // nodeViews: {},
            // history: true,
            // keyboardShortcuts: true,
            // inputRules: true,
            // schema:
        });
        this.dialogRef.updateSize('50rem')
    }

    onDescriptionAltered() {
        this.descriptionAltered = true;

    }



    onSubmitDescriptionInput(): void {

        let rawContent = this.form.value.editorContent;
        const description = toHTML(rawContent)

        this.firestoreService.updateDocument(this.pathToLsc, { description })
            .then((res: any) => {
                this.uiService.openSnackbar('lsc description updated')
                this.descriptionAltered = false;
                this.dialogRef.close();
            })
            .catch((err: FirebaseError) => {
                this.uiService.openSnackbar(`failed to update lsc description; ${err.message}`)
                this.dialogRef.close();
            })
    }




    private patchForm(description): void {
        this.form.patchValue({
            editorContent: toDoc(description)
        })
    }

    onCancel() {
        this.dialogRef.close();
    }
}
