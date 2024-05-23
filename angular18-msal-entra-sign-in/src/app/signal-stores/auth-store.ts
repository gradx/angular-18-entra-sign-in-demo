import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AuthUser } from '../models/auth-user';
import { Injectable, inject } from '@angular/core';

const AUTH_USER_TOKEN = "AuthUserToken"

type AuthState = {
  user: AuthUser | null;
};

const initialState: AuthState = {
  user: JSON.parse(sessionStorage.getItem(AUTH_USER_TOKEN) || '{}')
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    update(user: AuthUser): void {
      sessionStorage.setItem(AUTH_USER_TOKEN, JSON.stringify(user));

      patchState(store, { user: { ...user, user } as AuthUser });
    },
  }))
);

@Injectable({ providedIn: 'root' })
export class AuthStoreProvider {
  public store = inject(AuthStore); 
  readonly APP_TOKEN = 'APP_TOKEN';

  saveToken(data: string) {
    sessionStorage.setItem(this.APP_TOKEN, data);
  }

  getToken() : string | null {
    return sessionStorage.getItem(this.APP_TOKEN);
  }
}
