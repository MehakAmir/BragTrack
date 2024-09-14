import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  message: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.signupForm.valid) {
      this.http.post<{ message: string }>('http://localhost:8080/user/signup', this.signupForm.value)
        .subscribe({
          next: (response) => {
            this.message = response.message;
          },
          error: (error) => {
            this.message = 'Signup failed. ' + (error.error?.message || '');
          }
        });

    }
  }

}

