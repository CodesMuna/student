import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignUpComponent},
    {path: 'registration', component: RegistrationComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];
