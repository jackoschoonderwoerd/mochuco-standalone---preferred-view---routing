import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer';
import * as ADMIN from 'src/app/admin/store/admin.actions'
import { take } from 'rxjs';
import { LSC } from '../shared/models/language-specific-content.model';
import { Item } from '../shared/models/item.model';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    constructor(
        private store: Store
    ) { }

    // deleteLsc() {
    //     this.store.dispatch(new ADMIN.SetSelectedLSC(null))
    // }

    // updateLsc(property: string, newValue: string) {
    //     this.store.select(fromRoot.getSelectedLSC)
    //         .pipe(take(1))
    //         .subscribe((currentLsc: LSC) => {
    //             switch (property) {

    //                 case 'name':
    //                     const updatedLscName: LSC = {
    //                         ...currentLsc,
    //                         name: newValue
    //                     }
    //                     this.store.dispatch(new ADMIN.SetSelectedLSC(updatedLscName))
    //                     break;
    //                 case 'description':
    //                     const updatedLscDescription: LSC = {
    //                         ...currentLsc,
    //                         description: newValue
    //                     }
    //                     this.store.dispatch(new ADMIN.SetSelectedLSC(updatedLscDescription));
    //                     break;
    //                 case 'audioUrl':
    //                     const updatedLscAudioUrl: LSC = {
    //                         ...currentLsc,
    //                         audioUrl: newValue
    //                     }
    //                     this.store.dispatch(new ADMIN.SetSelectedLSC(updatedLscAudioUrl));
    //                     break;
    //                 default:
    //                     this.store.dispatch(new ADMIN.SetSelectedLSC(currentLsc));
    //                 // console.log('lsc not updated');
    //             }
    //         })
    // }
    // updateItem(property: string, newValue: any) {
    //     this.store.select(fromRoot.getSelectedItem)
    //         .pipe(take(1))
    //         .subscribe((currentItem: Item) => {
    //             switch (property) {
    //                 case 'name':
    //                     // console.log(newValue);
    //                     const updatedItemName: Item = {
    //                         ...currentItem,
    //                         name: newValue
    //                     }
    //                     this.store.dispatch(new ADMIN.SetSelectedItem(updatedItemName))
    //                     break;
    //                 case 'isMainPage':
    //                     // console.log(newValue)
    //                     const updatedItemIsMainPage: Item = {
    //                         ...currentItem,
    //                         isMainPage: newValue
    //                     }
    //                     this.store.dispatch(new ADMIN.SetSelectedItem(updatedItemIsMainPage))
    //                     break;
    //                 case 'imageUrl':
    //                     // console.log(newValue)
    //                     const updatedItemImageUrl: Item = {
    //                         ...currentItem,
    //                         imageUrl: newValue
    //                     }
    //                     this.store.dispatch(new ADMIN.SetSelectedItem(updatedItemImageUrl))
    //                 default:
    //                     this.store.dispatch(new ADMIN.SetSelectedItem(currentItem))
    //                     console.log('item not updated');
    //             }
    //         })
    // }

}
