import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private apiUrl = 'https://localhost:7109';

  readonly headers = new HttpHeaders().append(
    'Content-Type',
    'application/json'
  );

  constructor(private http: HttpClient) { }

  getMessage(): Observable<string> {
    return this.http.get(`${this.apiUrl}/security/getMessage`, {  responseType: 'text' });
  }
  

  validateToken(data: string) {
    return this.http.post(this.apiUrl + '/security/createToken', data, {
      headers: this.headers
    });
  }
}
