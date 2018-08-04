import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule} from "@angular/material";
import { MatCardModule } from "@angular/material";
import { MatInputModule } from "@angular/material";
import { MatToolbarModule } from "@angular/material";
import { MatFormFieldModule } from "@angular/material";

import { AppComponent } from './app.component';
import { GapRuleComponent } from './gap-rule/gap-rule.component';

@NgModule({
  declarations: [
    AppComponent,
    GapRuleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
