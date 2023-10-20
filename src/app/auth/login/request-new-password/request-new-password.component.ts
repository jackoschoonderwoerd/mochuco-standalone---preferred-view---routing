import { Component, Inject, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Auth } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-request-new-password',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
    ],
    templateUrl: './request-new-password.component.html',
    styleUrls: ['./request-new-password.component.scss']
})
export class RequestNewPasswordComponent implements OnInit {

    @ViewChild('emailInput') private email: HTMLInputElement
    form: FormGroup
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public afAuth: Auth,
        private dialogRef: MatDialogRef<RequestNewPasswordComponent>,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.initForm();
        if (this.data && this.data.email) {
            this.form.patchValue({
                email: this.data.email
            })
        }
    }
    initForm() {
        this.form = this.fb.group({
            email: new FormControl(null, [Validators.required])
        })
    }
    onConfirm() {
        this.dialogRef.close(this.form.value.email);
    }
    onCancel() {
        this.dialogRef.close(false);
    }
}
