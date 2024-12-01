import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { PortalService } from '../portal.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule, MatListModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatDatepickerModule,MatNativeDateModule,MatSelectModule,
    MatInputModule,  FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe,
    MatDatepickerModule,
    MatSelectModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  private datePipe = inject(DatePipe);

  student = {
    LRN: '',
    fname: '',
    lname: '',
    glevel: '',
    strand: '',
    email: '',
    password: ''
  };
  
  signupForm = new FormGroup({
    LRN: new FormControl(null),
    fname: new FormControl(null),
    lname: new FormControl(null),
    mname: new FormControl(null),
    bdate: new FormControl(null),
    email: new FormControl(null),
    password: new FormControl(null),
    password_confirmation: new FormControl(null),
  })

  constructor(private route: Router, private conn: PortalService) {}

  signup() {
    const formattedDate = this.datePipe.transform(this.signupForm.value.bdate, 'yyyy-MM-dd');
    this.signupForm.patchValue({ bdate: formattedDate });

    // Format the date before submitting
    this.conn.signup(this.signupForm.value)
      .subscribe((result: any) => {
        if (result != null) {
          console.log('Success');
          this.route.navigate(['/login'])
        }
        console.log(result);
      });
  }

  // Method to handle form submission
  // register(form: any) {
  //   this.conn.createStudent(this.student).subscribe(
  //     response => {
  //       console.log('Student updated:', response);
  //       this.router.navigate(['/login']); // Navigate after successful update
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.error('Error updating student:', error);
  //     }
  //   );
  // }
}
