import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, AuthError } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UiService } from '../shared/ui.service';
import { WarningComponent } from '../shared/warning/warning.component';
import { FirestoreService } from '../admin-services/firestore.service';
import { MochucoUser } from '../shared/models/mochuco-user.model';
import { ConfirmComponent } from '../shared/confirm/confirm.component';

@Component({
    selector: 'app-user-data',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule],
    templateUrl: './user-data.component.html',
    styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent {
    constructor(
        public afAuth: Auth,
        private authService: AuthService,
        private dialog: MatDialog,
        private uiService: UiService,
        private firestoreService: FirestoreService) { }

    onEditUsername() {
        const dialogRef = this.dialog.open(UpdateUserComponent, {
            data: {
                displayName: this.afAuth.currentUser.displayName
            }
        })
        dialogRef.afterClosed().subscribe((displayName: string) => {
            if (displayName) {
                this.authService.updateDisplayName(displayName)
                    .then((res) => {
                        this.uiService.openSnackbar('display name updated')
                    })
                    .catch((err: AuthError) => {
                        this.uiService.openSnackbar(`failed to update display name; ${err.message}`)
                    });
            }
        })

    }
    onDeleteAccount() {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
                message: 'This will permanently delete your account'
            }
        })
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                const uid = this.afAuth.currentUser.uid
                const pathToUser = `users/${uid}`
                this.firestoreService.getDocument(pathToUser)
                    .subscribe((user) => {
                        console.log(user);
                        if (user.venuesOwned.length > 0) {
                            this.dialog.open(WarningComponent, {
                                data: {
                                    message: `there are/is still ${user.venuesOwned.length} venue/venues associated with this account. Delete these first before deleting the account`
                                }
                            })
                        } else {
                            this.deleteAccount(uid)
                        }
                    })
            }
        })
    }
    private deleteAccount(uid: string) {
        console.log('proceed deleting account')
    }
}
