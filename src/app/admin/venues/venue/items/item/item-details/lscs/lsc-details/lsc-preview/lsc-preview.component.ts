import { Component, Input, OnInit, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { LscsService } from '../../lscs.service';
import { MatIconModule } from '@angular/material/icon';
import { ItemsService } from '../../../../../items.service';
import { UiService } from 'src/app/admin/shared/ui.service';
import { FirebaseError } from '@angular/fire/app';
import { HeaderComponent } from 'src/app/navigation/header/header.component';
import { FooterComponent } from 'src/app/navigation/footer/footer.component';
import { getSelectedLSC } from '../../../../../../../../../app.reducer';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { LscDescriptionComponent } from '../lsc-description/lsc-description.component';

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
        LscDescriptionComponent
    ],
    templateUrl: './lsc-preview.component.html',
    styleUrls: ['./lsc-preview.component.scss']
})







export class LscPreviewComponent implements OnInit, AfterViewInit, OnDestroy {



    // @Input() name: string;
    // @Input() description: string;
    belatedName: string;
    contentChanged: boolean = false;


    editmode: boolean = false;
    selectedVenue: Venue;
    selectedItem: Item;
    selectedLSC: LSC;
    lsc$: Observable<DocumentData>;
    item$: Observable<DocumentData>;
    name$: Observable<LSC>
    description$: Observable<string>;
    description: any;
    name: string;
    // editor: Editor;


    constructor(
        private store: Store<fromRoot.State>,
        public LscsService: LscsService,
        private itemsService: ItemsService,
        private uiService: UiService
    ) { }

    ngOnInit(): void {
        // this.editor = new Editor();
        this.LscsService.descriptionUdated$.subscribe((description: any) => {
            console.log(description)
            this.description = description
        })
        this.LscsService.nameUpdated$.subscribe((name: string) => {

            this.name = name;
        })
        this.lsc$ = this.store.select(fromRoot.getSelectedLSC);
        this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
            if (selectedVenue) {
                this.selectedVenue = { ...selectedVenue };
                this.store.select(fromRoot.getSelectedItem).subscribe((selectedItem: Item) => {
                    if (selectedItem) {
                        this.selectedItem = { ...selectedItem }
                        this.item$ = this.itemsService.getItemByItemId(
                            this.selectedVenue.id,
                            this.selectedItem.id)
                        this.store.select(fromRoot.getSelectedLSC).subscribe((selectedLSC: LSC) => {
                            // console.log('hi')
                            this.selectedLSC = { ...selectedLSC }
                            this.description = this.selectedLSC.description
                            this.name = this.selectedLSC.name;

                            setTimeout(() => {
                                this.contentChanged = false
                            }, 1000);
                        })
                    }
                })
            }
        })
    }

    getContentChanged(status?) {
        if (!status) {
            return false;
        } else {
            return status
        }
    }
    ngAfterViewInit(): void {

        // this.contentChanged = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes)
        this.contentChanged = true

    }
    ngOnDestroy(): void {
        // this.editor.destroy()
    }
}
