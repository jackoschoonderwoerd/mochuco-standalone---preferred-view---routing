import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-visitor-error-page',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    templateUrl: './visitor-error-page.component.html',
    styleUrls: ['./visitor-error-page.component.scss']
})
export class VisitorErrorPageComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<VisitorErrorPageComponent>

    ) { }

    onOk() {
        this.dialogRef.close();
    }
}
