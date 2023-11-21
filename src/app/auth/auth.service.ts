import { Injectable } from '@angular/core';
import { MochucoUser } from '../admin/shared/models/mochuco-user.model';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    setPersistence,
    browserSessionPersistence,
    user,
    signOut,
    getAuth,
    onAuthStateChanged,
    User,
    UserCredential,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification,
    sendPasswordResetEmail
} from '@angular/fire/auth';
import { LoginData } from '../admin/shared/models/login-data.model';
import { Store } from '@ngrx/store';
import * as fromRoot from './../app.reducer';
import * as ADMIN from './../admin/store/admin.actions'
import { VenuesService } from '../admin/venues/venues.service';
import { Router } from '@angular/router';
import * as AUTH from 'src/app/auth/store/auth.actions'
import { FirestoreService } from '../admin/admin-services/firestore.service';
import { DocumentReference } from '@angular/fire/firestore';
import { FirebaseError } from '@angular/fire/app';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private afAuth: Auth,
        private router: Router,
        private venuesService: VenuesService,
        private store: Store<fromRoot.State>,
        private firestoreService: FirestoreService) { }

    login(loginData: LoginData) {
        return signInWithEmailAndPassword(this.afAuth, loginData.email, loginData.password)
    }

    signup(mochucoUser: MochucoUser) {
        // console.log(mochucoUser)
        return createUserWithEmailAndPassword(this.afAuth, mochucoUser.email, mochucoUser.password)
            .then((userCredential: UserCredential) => {
                return userCredential
            })
            .then((userCredential: UserCredential) => {
                console.log(`user authenticated`)
                const uid = userCredential.user.uid
                const pathToUser = `users/${uid}`
                const user = {
                    uid: uid,
                    venuesOwned: []
                }
                return this.firestoreService.setDoc(pathToUser, user)
            })
            .then((res: any) => {
                console.log(`user with empty venues-owned added to firestore ; ${res}`)
            })
            .catch((err: FirebaseError) => {
                console.log(`failed to add user; ${err.message}`)
            })
    }

    logout() {
        this.afAuth.signOut()
        localStorage.removeItem('adminState');
        localStorage.removeItem('state');
        this.clearStore();
        this.router.navigateByUrl('/auth/login');
        this.store.dispatch(new AUTH.SetIsLoggedIn(false))
    }
    updateDisplayName(displayName: string) {
        const auth = getAuth()
        return updateProfile(auth.currentUser, {
            displayName: displayName
        });
    }

    requestNewPassword(email) {
        const auth = getAuth()
        return sendPasswordResetEmail(
            auth, email,
            { url: 'http://localhost:4200/auth' });
    }
    clearStore() {
        this.store.dispatch(new AUTH.SetIsAdmin(false))
        this.store.dispatch(new ADMIN.SetAdminVenueId(null))
        this.store.dispatch(new ADMIN.SetAdminItemId(null))
    }

}
