import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SafePipeModule } from 'safe-pipe';
import { HighlightDirectiveDirective } from './highlight-directive.directive';
import { HighlightAdderComponent } from './src/highlight-adder/highlight-adder.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HighlightService } from './src/highlight-service/highlight.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommentDialogComponent } from './src/comment-dialog/comment-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    HighlightDirectiveDirective,
    HighlightAdderComponent,
    CommentDialogComponent,
  ],
  imports: [
    BrowserModule,
    SafePipeModule,
    NoopAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatMenuModule,
    MatDialogModule,
  ],
  providers: [HighlightService],
  bootstrap: [AppComponent],
})
export class AppModule {}
