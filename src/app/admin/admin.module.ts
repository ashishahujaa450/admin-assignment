import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AdminRoutingModule } from "./admin-routing.module";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { HeaderComponent } from "./header/header.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FooterComponent } from "./footer/footer.component";
import { AdminComponent } from "./admin/admin.component";
import { ProfileComponent } from "./profile/profile.component";
import { BlankComponent } from "./blank/blank.component";
import { IconsComponent } from "./icons/icons.component";
import { BasicTableComponent } from "./basic-table/basic-table.component";
import { ErrorComponent } from "./error/error.component";
import { StudentRecordsComponent } from "./student-records/student-records.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    DashboardComponent,
    FooterComponent,
    AdminComponent,
    ProfileComponent,
    BlankComponent,
    IconsComponent,
    BasicTableComponent,
    ErrorComponent,
    StudentRecordsComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, FormsModule, SharedModule],
})
export class AdminModule {}
