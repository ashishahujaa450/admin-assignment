import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ErrorComponent } from "./error/error.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { CustomSpinnerComponent } from "./custom-spinner/custom-spinner.component";

@NgModule({
  declarations: [
    ErrorComponent,
    LoadingSpinnerComponent,
    CustomSpinnerComponent,
  ],
  imports: [CommonModule],
  exports: [ErrorComponent, LoadingSpinnerComponent, CustomSpinnerComponent],
})
export class SharedModule {}
