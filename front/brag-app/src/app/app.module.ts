import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router'; // Import RouterModule
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordDialogComponent } from './reset-password-dialog/reset-password-dialog.component'; // Use provideHttpClient
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DocumentService } from './document.service'; // Ensure this import
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormComponent } from './form/form.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { QuillModule } from 'ngx-quill';
import { HomeComponent } from './home/home.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';



const routes: Routes = [
  { path: 'signup', component: SignupComponent }, // Define routes
  { path: '', redirectTo: '/signup', pathMatch: 'full' }, // Default route
];
@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordDialogComponent,
    FormComponent,
    HomeComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MatNativeDateModule,
    EditorModule, FlexLayoutModule,
    BsDatepickerModule.forRoot(),
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatTooltipModule,
    MatListModule,
    QuillModule.forRoot()

  ],
  providers: [
    DocumentService,
    provideHttpClient(withFetch()),
    provideAnimationsAsync(), // Configure fetch API for HttpClient

    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

















