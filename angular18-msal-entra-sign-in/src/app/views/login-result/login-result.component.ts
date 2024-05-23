import { Component } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { AuthStoreProvider } from '../../signal-stores/auth-store';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

@Component({
  selector: 'app-login-result',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './login-result.component.html',
  styleUrl: './login-result.component.less',
})

export class LoginResultComponent {
  authProvider: AuthStoreProvider;
  data: DataService;
  message$: Observable<string> | null = null;
  authService: MsalService;

  constructor(private msal: MsalService, private authStoreProvider: AuthStoreProvider, private dataService: DataService) {
    this.authProvider = authStoreProvider;
    this.data = dataService;
    this.authService = msal;
  }

  // http://localhost:4200/login-result#code=M.C547_SN1.2.U.fc7a87a1-bdc0-0fef-e805-eb2278e13627&client_info=eyJ2ZXIiOiIxLjAiLCJzdWIiOiJBQUFBQUFBQUFBQUFBQUFBQUFBQUFQV2F3cFVWckZ3aTZHSEFQaFA3N0tFIiwibmFtZSI6IkRhdmlkIFlvIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZ3JhZHhAaG90bWFpbC5jb20iLCJvaWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDhjNC0xMTU2NmQ4ZjBlODEiLCJ0aWQiOiI5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJob21lX29pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wOGM0LTExNTY2ZDhmMGU4MSIsInVpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wOGM0LTExNTY2ZDhmMGU4MSIsInV0aWQiOiI5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQifQ&state=eyJpZCI6IjAxOGZhMjFiLWZlYjktNzcwOC05NmNjLTYwMTBhNWQxMjQzNCIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0=

  ngOnInit() {
    this.load();
    
    if (this.authService.instance.getAllAccounts().length > 0)
      this.loadProfile();
  }

  load() {
    this.authService.handleRedirectObservable().subscribe({ 
      next: (result: AuthenticationResult) => {
         if (result != null && result.account != null) {
            this.authService.instance.setActiveAccount(result.account);
            this.loadProfile();  
         }
      },
      error: (error) => console.log(error)
   });
  }

  loadProfile() {
    this.authService.acquireTokenSilent({
      scopes: ['https://graph.microsoft.com/User.Read'],
      account: this.authService.instance.getAllAccounts()[0],
    }).subscribe(res => {
      this.dataService.validateToken(JSON.stringify(res)).subscribe(response => {
        let result = response as string;
        let responsePayload = decodeJwtResponse(result);

        this.authProvider.store.update({ 
            name: responsePayload.name, 
            sub: responsePayload.sub, 
            given_name: responsePayload.given_name, 
            family_name: responsePayload.family_name, 
            email: responsePayload.email,
            picture: responsePayload.website 
          }
        );

        this.authProvider.saveToken(result);
        this.message$ = this.dataService.getMessage();
      })
    });

    function decodeJwtResponse(token: string) {
      let base64Url = token.split('.')[1]
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    }
  }

}
