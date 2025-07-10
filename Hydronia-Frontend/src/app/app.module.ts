import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
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
