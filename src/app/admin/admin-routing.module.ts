import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdminComponent } from "./admin/admin.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProfileComponent } from "./profile/profile.component";
import { IconsComponent } from "./icons/icons.component";
import { BlankComponent } from "./blank/blank.component";
import { BasicTableComponent } from "./basic-table/basic-table.component";
import { ErrorComponent } from "./error/error.component";
import { AuthGuardGuard } from "../auth/auth-guard.guard";
import { StudentRecordsComponent } from "./student-records/student-records.component";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    canActivate: [AuthGuardGuard],
    canActivateChild: [AuthGuardGuard],
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "profile", component: ProfileComponent },
      { path: "records", component: StudentRecordsComponent },
      { path: "icons", component: IconsComponent },
      { path: "basic-table", component: BasicTableComponent },
      { path: "blank", component: BlankComponent },
    ],
  },
  { path: "**", component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
