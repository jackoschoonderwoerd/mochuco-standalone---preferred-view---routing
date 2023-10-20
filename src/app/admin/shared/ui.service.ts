import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from './confirm/confirm.component';

@Injectable({
    providedIn: 'root'
})
export class UiService {

    constructor(
        private snackbar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    openSnackbar(message: string) {
        this.snackbar.open(message, 'OK')
    }
    confirm(message) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message
            }
        })
        const promise = new Promise((resolve, reject) => {
            dialogRef.afterClosed().subscribe((res: any) => {
                resolve(res)
            })
        })
        return promise
    }
}
