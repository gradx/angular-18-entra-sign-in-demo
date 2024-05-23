import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStoreProvider }  from './signal-stores/auth-store';
import { DataService } from './services/data.service';
import { MsalService, MsalModule } from '@azure/msal-angular';
import { RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MsalBroadcastService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  providers: [AuthStoreProvider, DataService, MsalBroadcastService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})


export class AppComponent {
  title = 'Angular17SignInDemo';

  constructor(private authService: MsalService) {
    
  }

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe();
  }
}
