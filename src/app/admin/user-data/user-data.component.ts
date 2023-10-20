import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, AuthError } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UiService } from '../shared/ui.service';

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
        private uiService: UiService) { }

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
}
