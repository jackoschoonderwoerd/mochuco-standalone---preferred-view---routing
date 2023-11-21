import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-warning',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    templateUrl: './warning.component.html',
    styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<WarningComponent>
    ) { }

    ngOnInit(): void {
        // console.log(this.data)
    }

    onClose() {
        this.dialogRef.close()
    }
}
