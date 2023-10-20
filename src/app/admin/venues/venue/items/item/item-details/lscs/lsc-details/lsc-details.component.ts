import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fromRoot from 'src/app/app.reducer'
import { Store } from '@ngrx/store';
import { Item } from 'src/app/admin/shared/models/item.model';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { MatInputModule } from '@angular/material/input';
import { ItemsService } from '../../../../items.service';
import { UiService } from 'src/app/admin/shared/ui.service';
import { FirebaseError } from '@angular/fire/app';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as ADMIN from 'src/app/admin/store/admin.actions';
import { LscNameComponent } from './lsc-name/lsc-name.component';
import { LscsService } from '../lscs.service';
import { LscLanguageComponent } from './lsc-language/lsc-language.component';
import { LscPreviewComponent } from './lsc-preview/lsc-preview.component';
import { DocumentData } from '@angular/fire/firestore';
import { LscDescriptionComponent } from './lsc-description/lsc-description.component';
import { SelectAudioComponent } from './lsc-audio/lsc-audio.component';
import { MatDialog } from '@angular/material/dialog';



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

    selectedVenue: Venue
    selectedItem: Item;
    selectedLSC: LSC;
    languages: string[]
    availableLanguages: string[] = []

    selectedLanguage: string = null;
    nameFromDetails: string;
    descriptionFromDetails: string;
    description: string = null;
    lscs$: Observable<any[]>;
    editmode: boolean = false
    lsc$: Observable<DocumentData>
    nameAndDescriptionChanged: boolean = false;

    constructor(
        private store: Store<fromRoot.State>,
        private itemsService: ItemsService,
        private uiService: UiService,
        private router: Router,
        private LscsService: LscsService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.languages = this.LscsService.getLanguages()
        this.lsc$ = this.store.select(fromRoot.getSelectedLSC);
        this.getSelectedVenue().then((selectedVenue: Venue) => {
            this.selectedVenue = { ...selectedVenue }
        })
        this.getSelectedItem().then((selectedItem: Item) => {
            this.selectedItem = { ...selectedItem }
        })
        this.getSelectedLsc().then((selectedLsc: LSC) => {
            this.selectedLSC = { ...selectedLsc }
        })

        this.LscsService.nameUpdated$.subscribe((name: string) => {
            if (name) {
                this.nameAndDescriptionChanged = true
            }
        });
        this.LscsService.descriptionUdated$.subscribe((description: string) => {
            if (description) {
                this.nameAndDescriptionChanged = true
            }
        });


        // this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
        //     if (selectedVenue) {
        //         this.selectedVenue = { ...selectedVenue }
        //         this.store.select(fromRoot.getSelectedItem).subscribe((selectedItem: Item) => {
        //             if (selectedItem) {
        //                 this.selectedItem = { ...selectedItem };
        //                 this.store.select(fromRoot.getSelectedLSC).subscribe((selectedLSC: LSC) => {
        //                     if (selectedLSC) {
        //                         this.editmode = true;
        //                         this.selectedLSC = { ...selectedLSC }
        //                     }
        //                 })
        //             }
        //         })
        //     }
        // })
        this.store.select(fromRoot.getLSCNameDescriptionChanged).subscribe((status: boolean) => {
            this.nameAndDescriptionChanged = status
        })
        // this.getAvailableLanguages();
    }

    getSelectedVenue() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
                if (selectedVenue) {
                    resolve(selectedVenue)
                }
            })

        })
        return promise
    }
    getSelectedItem() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getSelectedItem).subscribe((selectedItem: Item) => {
                if (selectedItem) {
                    resolve(selectedItem)
                }
            })

        })
        return promise
    }
    getSelectedLsc() {
        const promise = new Promise((resolve, reject) => {
            this.store.select(fromRoot.getSelectedLSC).subscribe((selectedLsc: LSC) => {
                if (selectedLsc) {
                    this.editmode = true;
                    resolve(selectedLsc)
                }
            })
        })
        return promise
    }

    updateLSC() {
        this.LscsService.updateLSC(this.selectedVenue.id, this.selectedItem.id, this.selectedLSC)
            .then((res: any) => {
                this.uiService.openSnackbar('lsc updated');
                // this.LscsService.lscUpdateStatus(false)
                this.nameAndDescriptionChanged = false;
            })
            .catch((err: FirebaseError) => {
                this.uiService.openSnackbar(`failed to update lsc; ${err.message}`);
            })
    }


    editmodeChanged(status) {
        this.editmode = status;
    }


    onLanguageSelected(event) {
        console.log(event);
        this.selectedLanguage = event
    }
    onDescriptionKeyup(e) {
        this.description = (e.target.value)
    }

    onAddLsc() {
        console.log('onAddLsc')
        const lsc: LSC = {
            language: this.selectedLanguage,
            name: this.nameFromDetails ? this.nameFromDetails : null,
            description: this.description ? this.description : null
        }
        console.log(lsc)
        if (!this.editmode) {
            console.log('editmode: ' + this.editmode)
            this.LscsService.addLsc(this.selectedVenue.id, this.selectedItem.id, lsc)
                .then((res: any) => {
                    console.log(res)
                    this.uiService.openSnackbar('lsc added to item');
                    this.router.navigateByUrl('/admin/item-details');
                    this.nameAndDescriptionChanged = false;
                    this.store.dispatch(new ADMIN.SetSelectedLSC(null));
                })
                .catch((err: FirebaseError) => {
                    this.uiService.openSnackbar(`failed to add lsc to item ; ${err.message}`);
                });
        } else {
            this.LscsService.updateLSC(this.selectedVenue.id, this.selectedItem.id, lsc)
                .then((res: any) => {
                    this.uiService.openSnackbar('lsc updated');
                    this.router.navigateByUrl('/admin/item-details');
                    this.nameAndDescriptionChanged = false;
                    this.store.dispatch(new ADMIN.SetSelectedLSC(null));
                })
                .catch((err: FirebaseError) => {
                    this.uiService.openSnackbar(`failed to update lsc; ${err.message}`);
                });
        }

    }

    onBackToItemDetails() {
        this.router.navigateByUrl('/admin/item-details');
        this.store.dispatch(new ADMIN.SetSelectedLSC(null));
    }
}
