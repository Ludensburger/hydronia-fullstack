import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // add protected routes here
];

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes), // add this!
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:8000'],
        disallowedRoutes: ['http://localhost:8000/api/token/'],
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
