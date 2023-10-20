import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sidenav',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

    @Output() closeSidenav = new EventEmitter<void>();

    onClose() {
        this.closeSidenav.emit()
    }

}
