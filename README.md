# MSAL v3 + Angular 18 + Popup/Redirect demo

![Angular](https://img.shields.io/badge/Angular-v18-blue)
![.NET 8.0](https://img.shields.io/badge/.NET-v8.0-blue)

Complete e2e demo of an integration with Microsoft Entra using MSAL v3 (client) and .NET 8.0 Web API (server)

**Includes:** 
- Sign In
- Token relay to server
- Token validation server-side
- JWT setup in Web Api
- Identity managed in NgRx Signal Store
- _provideExperimentalZonelessChangeDetection_](https://netbasal.com/navigating-the-new-era-of-angular-zoneless-change-detection-unveiled-e7404de69b89)

Designed as a skeleton project that can help bootstrap a new application with minimal changes

### Configuration Required after setting up tenant in Azure

Update app.config.ts 
`redirectUri: 'http://localhost:4200/login-result', `

and environment.ts for Angular
`clientId: '165040ca-d322-433d-8dd9-ffdc95008c38'`

Update appsettings.json for .NET 8.0 
```typescript
  "Entra": {
    "Issuer": "https://login.microsoftonline.com/",
    "ClientId": "165040ca-d322-433d-8dd9-ffdc95008c38",
    "TenantId": "57543043-e835-409c-ad0b-9f3b46924a55",
    "Audience": "165040ca-d322-433d-8dd9-ffdc95008c38",
    "Graph": "https://graph.microsoft.com/v1.0/me/"
  },
```
