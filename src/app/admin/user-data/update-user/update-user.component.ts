import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-update-user',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    templateUrl: './update-user.component.html',
    styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {

    form: FormGroup

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<UpdateUserComponent>
    ) { }

    ngOnInit(): void {
        this.initForm();
        if (this.data && this.data.displayName) {
            this.form.patchValue({
                name: this.data.displayName
            })
        }
    }

    initForm() {
        this.form = this.fb.group({
            name: new FormControl('', [Validators.required])
        })
    }
    onConfirm() {
        this.dialogRef.close(this.form.value.name)
    }
    onCancel() {
        this.dialogRef.close()
    }
}
