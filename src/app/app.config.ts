import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';

import { importProvidersFrom, EnvironmentProviders } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environments';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideStore } from '@ngrx/store';
import { reducers } from './app.reducer';

import { QRCodeModule } from 'angularx-qrcode';
import { NgxEditorComponent, NgxEditorModule } from 'ngx-editor';
import * as fromRoot from 'src/app/app.reducer';

const firebaseProviders: EnvironmentProviders = importProvidersFrom([
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth())
]);


export const appConfig: ApplicationConfig = {

    providers: [
        provideRouter(routes),
        provideAnimations(),
        firebaseProviders,
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),
        provideStore(reducers),
        importProvidersFrom(
            [
                QRCodeModule,
                MatDialogModule,
                MatSnackBarModule,
                NgxEditorModule.forRoot({
                    locals: {
                        // menu
                        bold: 'Bold',
                        italic: 'Italic',
                        code: 'Code',
                        underline: 'Underline',
                        strike: 'Strike',
                        blockquote: 'Blockquote',
                        bullet_list: 'Bullet List',
                        ordered_list: 'Ordered List',
                        heading: 'Heading',
                        h1: 'Header 1',
                        h2: 'Header 2',
                        h3: 'Header 3',
                        h4: 'Header 4',
                        h5: 'Header 5',
                        h6: 'Header 6',
                        align_left: 'Left Align',
                        align_center: 'Center Align',
                        align_right: 'Right Align',
                        align_justify: 'Justify',
                        text_color: 'Text Color',
                        background_color: 'wheat',
                        insertLink: 'Insert Link',
                        removeLink: 'Remove Link',
                        insertImage: 'Insert Image',

                        // pupups, forms, others...
                        url: 'URL',
                        text: 'Text',
                        openInNewTab: 'Open in new tab',
                        insert: 'Insert',
                        altText: 'Alt Text',
                        title: 'Title',
                        remove: 'Remove',
                    },
                })

            ]),

    ]
};
