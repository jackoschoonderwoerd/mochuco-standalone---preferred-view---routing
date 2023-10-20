import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormGroup,
    FormBuilder,
    FormControl,
    Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginData } from 'src/app/admin/shared/models/login-data.model';
import { MochucoUser } from 'src/app/admin/shared/models/mochuco-user.model';
import { AuthService } from '../auth.service';
import { UserCredential } from '@angular/fire/auth';
import { UiService } from 'src/app/admin/shared/ui.service';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RequestNewPasswordComponent } from './request-new-password/request-new-password.component';
import { FirebaseError } from '@angular/fire/app';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer';
import * as ADMIN from 'src/app/auth/store/auth.actions'

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        MatFormFieldModule,
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    signupForm: FormGroup;
    existingUser: boolean = false
    newUser: boolean = false

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private uiService: UiService,
        private router: Router,
        private dialog: MatDialog,
        private store: Store
    ) { }
    ngOnInit(): void {

    }
    onExistingUser() {
        this.existingUser = true;
        this.newUser = false;
        this.initLoginForm()
    }
    initLoginForm() {
        this.loginForm = this.fb.group({
            email: new FormControl('jackoboes@gmail.com', [Validators.required]),
            password: new FormControl('123456', [Validators.required])
        })
    }
    onLogin() {
        const formValue = this.loginForm.value;
        const loginData: LoginData = {
            email: formValue.email,
            password: formValue.password
        }
        this.authService.login(loginData)
            .then((userCredential: UserCredential) => {
                console.log(userCredential.user.uid)
                if (userCredential.user.uid === 'DhwbsQYD4OVm2j7d5ZzZGiGoHXJ2') {
                    this.store.dispatch(new ADMIN.SetIsAdmin(true))
                }
                this.uiService.openSnackbar(`${userCredential.user.email} logged in`);
                this.router.navigateByUrl('/admin/venues')
            })
            .catch((err: any) => {
                this.uiService.openSnackbar(`failed to login user; ${err.message}`)
            })
    }
    onNewUser() {
        this.newUser = true;
        this.existingUser = false;
        this.initSignupForm();
    }
    initSignupForm() {
        this.signupForm = this.fb.group({
            displayName: new FormControl('jacko', [Validators.required]),
            email: new FormControl('jackoboes@gmail.com', [Validators.required]),
            password: new FormControl('123456', [Validators.required])
        })
    }

    onSignup() {
        const formValue = this.signupForm.value;
        const mochucoUser: MochucoUser = {
            displayName: formValue.displayName,
            email: formValue.email,
            password: formValue.password
        }
        this.authService.signup(mochucoUser)
            .then((data: any) => {
                console.log(data)
                this.router.navigateByUrl('/admin/venues');
                this.uiService.openSnackbar('new user signed up and logged in');
            })
            .catch((err: any) => {
                this.uiService.openSnackbar(`failed to sign up new user; ${err.message}`)
            })
    }
    onRequestNewPassword() {
        const dialogRef = this.dialog.open(RequestNewPasswordComponent, {
            data: {
                email: this.loginForm.value.email,
                message: 'a link for a new password request will be sent to this email address'
            }
        })
        dialogRef.afterClosed().subscribe((email: string) => {
            if (email) {
                console.log(email)
                this.authService.requestNewPassword(email)
                    .then((res: any) => {
                        this.uiService.openSnackbar('email request new password sent')
                    })
                    .catch((err: FirebaseError) => {
                        this.uiService.openSnackbar(`request new password failed; ${err.message}`)
                    })
            }
        })
    }
}
