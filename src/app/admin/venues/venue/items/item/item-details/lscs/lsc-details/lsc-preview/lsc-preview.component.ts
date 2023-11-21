import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Editor, NgxEditorModule, Validators } from 'ngx-editor';
import { FirestoreService } from 'src/app/admin/admin-services/firestore.service';
import { FooterComponent } from 'src/app/navigation/footer/footer.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/navigation/header/header.component';
import { Item } from 'src/app/admin/shared/models/item.model';
import { ItemsService } from '../../../../../items.service';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { LscDescriptionComponent } from '../lsc-description/lsc-description.component';
import { LscsService } from '../../lscs.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { UiService } from 'src/app/admin/shared/ui.service';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import * as fromRoot from 'src/app/app.reducer'



@Component({
    selector: 'app-lsc-preview',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        HeaderComponent,
        FooterComponent,
        NgxEditorModule,
        LscDescriptionComponent,
        FormsModule,
        ReactiveFormsModule,

    ],
    templateUrl: './lsc-preview.component.html',
    styleUrls: ['./lsc-preview.component.scss']
})







export class LscPreviewComponent implements OnInit, OnDestroy {



    contentChanged: boolean = false;


    editmode: boolean = false;
    lsc$: Observable<DocumentData>;
    item$: Observable<DocumentData>;
    editor: Editor;

    form = new FormGroup({
        editorContent: new FormControl('', Validators.required()),
    });


    constructor(
        private store: Store<fromRoot.State>,
        public LscsService: LscsService,
        private firestoreService: FirestoreService
    ) { }

    ngOnInit(): void {

        this.store.select(fromRoot.getAdminVenueId).subscribe((venueId: string) => {
            this.store.select(fromRoot.getAdminItemId).subscribe((itemId: string) => {
                const pathToItem = `venues/${venueId}/items/${itemId}`;
                this.item$ = this.firestoreService.getDocument(pathToItem);
                this.store.select(fromRoot.getAdminLanguage).subscribe((language: string) => {
                    const pathToLsc = `venues/${venueId}/items/${itemId}/languages/${language}`;
                    this.lsc$ = this.firestoreService.getDocument(pathToLsc);
                    this.lsc$.subscribe((lsc: LSC) => {
                        if (lsc) {
                            this.patchForm(lsc.description)
                        }
                    })
                })
            })
        })

        this.editor = new Editor();

    }
    private patchForm(description) {
        this.form.patchValue({ editorContent: description })
    }

    getContentChanged(status?) {
        if (!status) {
            return false;
        } else {
            return status
        }
    }


    ngOnChanges(changes: SimpleChanges) {
        this.contentChanged = true

    }
    ngOnDestroy(): void {
        this.editor.destroy()
    }
}
