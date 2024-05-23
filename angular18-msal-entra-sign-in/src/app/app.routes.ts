import { Routes } from '@angular/router';
import { LoginResultComponent } from './views/login-result/login-result.component';
import { SigninComponent } from './views/signin/signin.component';
import { authGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from './views/unauthorized/unauthorized.component';

export const routes: Routes = [
    { path: 'signin', component: SigninComponent },
    { path: 'login-result', component: LoginResultComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '',   redirectTo: '/signin', pathMatch: 'full' }, 
];
