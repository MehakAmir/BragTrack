import { Component } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  bragForm: FormGroup;
  achievements: any[] = [];
  showModal: boolean = false; // Control for showing/hiding modal

  constructor(private fb: FormBuilder) {
    this.bragForm = this.fb.group({
      achievementName: [''],
      achievementDate: [''],
      description: [''],
      impact: [''],
    });
  }


}