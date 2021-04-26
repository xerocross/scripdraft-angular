import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {APP_BASE_HREF} from '@angular/common';
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
    FormsModule
  ],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
