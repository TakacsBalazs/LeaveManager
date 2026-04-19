import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RequestLeaveComponent } from './pages/request-leave/request-leave.component';
import { MyRequestsComponent } from './pages/my-requests/my-requests.component';
import { RequestDetailsComponent } from './pages/request-details/request-details.component';
import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { adminGuard } from './core/guards/admin.guard';
import { UserListComponent } from './pages/user-list/user-list.component';
import { LeaveBalanceListComponent } from './pages/leave-balance-list/leave-balance-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'app', component: MainLayoutComponent, canActivate: [authGuard], children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'request-leave', component: RequestLeaveComponent },
        { path: 'my-requests', component: MyRequestsComponent },
        { path: 'requests/:id', component: RequestDetailsComponent},
        { path: 'manager-dashboard', component: ManagerDashboardComponent, canActivate: [adminGuard]},
        { path: 'user-list', component: UserListComponent, canActivate: [adminGuard]},
        { path: 'leave-balance-list', component: LeaveBalanceListComponent, canActivate: [adminGuard]}
    ]}
];
