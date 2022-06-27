import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService?.currentUserValue;
        if (currentUser?.token && (currentUser.userRole === 2 || currentUser.userRole === 3)) {
            // authorised so return true
            return true;
        }

        // failed
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService?.currentUserValue;
        if (currentUser?.token && (currentUser.userRole === 2 || currentUser.userRole === 3)) {
            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        return false;
    }
}
