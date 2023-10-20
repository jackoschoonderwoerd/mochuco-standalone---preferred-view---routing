import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';


@Component({
    selector: 'app-map',
    standalone: true,
    imports: [CommonModule, GoogleMapsModule,],
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    zoom = 50;
    center: google.maps.LatLngLiteral;
    options: google.maps.MapOptions = {
        mapTypeId: 'hybrid',
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        maxZoom: 15,
        minZoom: 8,
    };

    ngOnInit(): void {
        navigator.geolocation.getCurrentPosition((position) => {
            this.center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
        });
    }
    zoomIn() {
        if (this.zoom < this.options.maxZoom) this.zoom++;
    }

    zoomOut() {
        if (this.zoom > this.options.minZoom) this.zoom--;
    }
}
