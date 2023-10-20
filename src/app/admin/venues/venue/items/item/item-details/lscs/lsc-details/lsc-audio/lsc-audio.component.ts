import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import * as fromRoot from 'src/app/app.reducer'
import { Store } from '@ngrx/store';
import { Venue } from 'src/app/admin/shared/models/venue.model';
import { Item } from 'src/app/admin/shared/models/item.model';
import { LSC } from 'src/app/admin/shared/models/language-specific-content.model';
import { LscsService } from '../../lscs.service';
import { DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';
import { UiService } from 'src/app/admin/shared/ui.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/admin/shared/confirm/confirm.component';
import * as ADMIN from 'src/app/admin/store/admin.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-select-audio',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        ConfirmComponent,
        MatProgressSpinnerModule
    ],
    templateUrl: './lsc-audio.component.html',
    styleUrls: ['./lsc-audio.component.scss']
})
export class SelectAudioComponent implements OnInit {

    editmode: boolean = false;
    selectedVenue: Venue;
    selectedItem: Item;
    selectedLsc: LSC;
    lsc$: Observable<DocumentData>
    isLoading: boolean = false;

    constructor(
        private store: Store<fromRoot.State>,
        private lscsService: LscsService,
        private uiService: UiService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.lsc$ = this.store.select(fromRoot.getSelectedLSC);
        this.getSelectedVenue();
        this.getSelectedItem();
        this.getSelectedLsc()
    }
    private getSelectedVenue() {
        this.store.select(fromRoot.getSelectedVenue).subscribe((selectedVenue: Venue) => {
            if (selectedVenue) {
                this.selectedVenue = selectedVenue
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
                this.editmode = true;
                this.selectedLsc = { ...selectedLsc }
            }
        })
    }

    onAudioInputChange(event: any) {
        this.isLoading = true
        if (event && event.target instanceof Element) {
            const file = event.target.files[0]
            console.log(file);
            this.lscsService.storeAudioFile(
                this.selectedVenue.id,
                this.selectedItem.id,
                this.selectedLsc.language,
                file)
                .then((url: string) => {
                    this.uiService.openSnackbar(`audio file stored`)
                    this.lscsService.updateAudioUrl(
                        this.selectedVenue.id,
                        this.selectedItem.id,
                        this.selectedLsc.language,
                        url)
                    return url
                })
                .catch((err: FirebaseError) => {
                    this.uiService.openSnackbar(`failed to store audio file; ${err.message}`)
                    this.isLoading = false;
                })
                .then((url: string) => {
                    this.uiService.openSnackbar('updated audio url')
                    const updatedLsc: LSC = {
                        ...this.selectedLsc,
                        audioUrl: url
                    }
                    this.store.dispatch(new ADMIN.SetSelectedLSC(updatedLsc));
                    this.isLoading = false;
                }).catch((err: FirebaseError) => {
                    this.uiService.openSnackbar(`failed to update audio url; ${err.message}`);
                    this.isLoading = false;
                })
        }
    }

    onDeleteAudio() {
        this.confirmDelete().then((res: boolean) => {
            if (res) {
                this.lscsService.deleteAudioFromStorage(
                    this.selectedVenue.id,
                    this.selectedItem.id,
                    this.selectedLsc.language)
                    .then((res: any) => {
                        this.uiService.openSnackbar('audio file removed from storage')
                        this.lscsService.updateAudioUrl(
                            this.selectedVenue.id,
                            this.selectedItem.id,
                            this.selectedLsc.language,
                            null)
                    })
                    .catch((err: FirebaseError) => {
                        this.uiService.openSnackbar(`failed to remove audio file from storage; ${err.message}`)
                    })
                    .then((res: any) => {
                        this.uiService.openSnackbar(`audio url updated to null`);
                        this.store.dispatch(new ADMIN.SetSelectedLSC({
                            ...this.selectedLsc,
                            audioUrl: null
                        }));
                    }).catch((err: FirebaseError) => {
                        this.uiService.openSnackbar(`failed to update audio url to null; ${err.message}`)
                    })
            } else {
                this.uiService.openSnackbar('deletion audio cancelled')
            }
        })
    }

    confirmDelete() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'Are you sure? This will permanently delete the audio file'
            }
        })
        const promise = new Promise<boolean>((res, rej) => {
            dialogRef.afterClosed().subscribe((dialogResponse) => {
                res(dialogResponse)
            })
        })
        return promise;
    }
}
