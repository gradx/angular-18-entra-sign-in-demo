import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { PopupRequest } from '@azure/msal-browser';
import { AuthStoreProvider } from '../../signal-stores/auth-store';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [

  ],
  providers: [],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.less'
})

export class SigninComponent {
  env: any;
  authService: MsalService;
  dataService: DataService;

  constructor(private router: Router, private authProvider: AuthStoreProvider, private msal: MsalService, private data: DataService,   private http: HttpClient) { 
    this.env = environment;
    this.authService = msal;
    this.dataService = data;
  }

  loginPopup() {

    const POPUP_REQUEST: PopupRequest /*| SilentRequest*/ = {
      scopes: ['https://graph.microsoft.com/User.Read'],// Add more permissions in this array as needed.
      prompt: 'login',//'consent',//'create''login',//'select_account',
    }

    this.authService.acquireTokenPopup(POPUP_REQUEST)
      .subscribe(res => {
        this.router.navigateByUrl('/login-result');
      });
  }

  loginRedirect() {

    const POPUP_REQUEST: PopupRequest /*| SilentRequest*/ = {
      scopes: ['https://graph.microsoft.com/User.Read'],// Add more permissions in this array as needed.
      prompt: 'login',//'consent',//'create''login',//'select_account',
    }

    this.authService.acquireTokenRedirect(POPUP_REQUEST).subscribe();
  }
}
