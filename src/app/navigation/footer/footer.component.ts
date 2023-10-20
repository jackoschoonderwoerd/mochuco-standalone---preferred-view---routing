import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { VisitorLscLanguageComponent } from './visitor-select-language/visitor-select-language.component';
import { RouterModule } from '@angular/router';


@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        MatIconModule,
        VisitorLscLanguageComponent,

    ],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {



    constructor(
        private dialog: MatDialog,
    ) { }

    ngOnInit(): void { }

    onOpenSelectLanguage() {

        this.dialog.open(VisitorLscLanguageComponent)

    }

}
