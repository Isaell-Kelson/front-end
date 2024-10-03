import {Routes} from '@angular/router';
import {WelcomeComponent} from "./components/welcome/welcome.component";
import {LoginComponent} from "./components/login/login.component";
import {ListAdminComponent} from "./components/list-admin/list-admin.component";

export const routes: Routes = [
  {path: 'home', component: WelcomeComponent},
  {path: '', component: LoginComponent},
  {path: 'list', component: ListAdminComponent},
];
