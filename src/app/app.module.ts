import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DraftBoxComponent } from './draft-box/draft-box.component';
import { FormsModule } from '@angular/forms';
import { HelpComponent } from './help/help.component';

@NgModule({
  declarations: [
    AppComponent,
    DraftBoxComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
