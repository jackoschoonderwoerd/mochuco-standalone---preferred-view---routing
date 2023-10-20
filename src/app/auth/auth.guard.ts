import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer'
import { VisitorErrorPageComponent } from '../visitor/visitor-error-page/visitor-error-page.component';


export const authGuard: CanActivateFn = (route, state) => {

    const currentUser = inject(Auth).currentUser;
    const router = inject(Router);
    const dialog = inject(MatDialog)

    if (currentUser) {
        return true;
    } else {
        router.navigateByUrl('/auth/login')
        dialog.open(VisitorErrorPageComponent, {
            data: {
                message: 'You need to be logged in in order to have access to this part of the website.'
            }
        })


        return (false)

    }
};
