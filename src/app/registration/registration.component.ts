import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup} from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import {StepperOrientation, MatStepperModule} from '@angular/material/stepper';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AsyncPipe, DatePipe} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { PortalService } from '../portal.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  providers: [PortalService, provideNativeDateAdapter(), ],
  imports: [ MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit{
  private _formBuilder = inject(FormBuilder);
  private datePipe = inject(DatePipe);

  gradelevel: string[] =[
    '7',
    '8',
    '9',
    '10',
    '11',
    '12'
  ];

  selectedLevel: any;

  studentDetails: any;
  studentName: any;

  eDetails: any;
  pDetails: any;

  selectedFile: any = null;
  uploadMessage: any;
  imageUrl: any;

  signupForm = this._formBuilder.group({
    LRN: ['', Validators.required],
    fname: ['', Validators.required],
    lname: ['', Validators.required],
    mname: [''],
    bdate: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    password_confirmation: ['', Validators.required],
  });

  personalInfoForm = this._formBuilder.group({
    LRN: ['', Validators.required],
    fname: ['', Validators.required],
    lname: ['', Validators.required],
    mname: [''],
    bdate: ['', Validators.required],
    suffix: [''],
    bplace: ['', Validators.required],
    religion: ['', Validators.required],
    address: ['', Validators.required],
    contact_no: ['', Validators.required],
    gender: ['', Validators.required],
  });

  enrollmentDetails = this._formBuilder.group({
    LRN: ['', Validators.required],
    grade_level: ['', Validators.required],
    last_attended: ['', Validators.required],
    public_private: ['', Validators.required],
    strand: ['', Validators.required],
    school_year: ['', Validators.required],
    guardian_name: ['', Validators.required],
  });

  paymentDetails = this._formBuilder.group({
    LRN: ['', Validators.required],
    amount_paid: ['', Validators.required],
    proof_payment: ['', Validators.required],
    description: ['', Validators.required],
  });

  studentForm = new FormGroup({
    fname: new FormControl(null),
    lname: new FormControl(null),
    mname: new FormControl(null),
    email: new FormControl(null),
    password: new FormControl(null),
  })

  stepperOrientation: Observable<StepperOrientation>;

  constructor(private conn: PortalService) {
    const breakpointObserver = inject(BreakpointObserver);
    

    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }


  ngOnInit(): void {
    const enrollmentData = JSON.parse(localStorage.getItem('studentData') || '{}');
    this.eDetails = enrollmentData.eData;
    this.pDetails = enrollmentData.pData;
    console.log(enrollmentData)

    const localStorageData = JSON.parse(localStorage.getItem('student') || '{}');
    const studentData = localStorageData.student; // Access the student object
    this.studentDetails = studentData;
    this.studentName = studentData.fname + ' ' + studentData.mname + ' ' + studentData.lname;
    console.log(studentData); // Check what data is being retrieved

    

    if (studentData) {
        this.personalInfoForm.patchValue({
            LRN: studentData.LRN || '',
            fname: studentData.fname || '',
            lname: studentData.lname || '',
            mname: studentData.mname || '',
            bdate: studentData.bdate || '',
            suffix: studentData.suffix || '',
            bplace: studentData.bplace || '',
            religion: studentData.religion || '',
            address: studentData.address || '',
            contact_no: studentData.contact_no || '',
            gender: studentData.gender || ''
        })
      if (this.personalInfoForm.valid) {
        this.personalInfoForm.markAsPristine();
      }
    }

    if (enrollmentData.eData) {
      this.enrollmentDetails.patchValue({
        LRN: studentData.LRN || '',
        grade_level: enrollmentData.eData.grade_level || '',
        last_attended:  enrollmentData.eData.last_attended || '',
        public_private:  enrollmentData.eData.public_private || '',
        strand:  enrollmentData.eData.strand || '',
        school_year:  enrollmentData.eData.school_year || '',
        guardian_name:  enrollmentData.eData.guardian_name || '',
      })

      this.selectedLevel = enrollmentData.eData.grade_level || ''

      if (this.enrollmentDetails.valid) {
        this.enrollmentDetails.markAsPristine();
      }
    }

    if (enrollmentData.pData) {
      this.paymentDetails.patchValue({
        LRN: studentData.LRN || '',
        amount_paid: enrollmentData.pData.amount_paid || '',
        description:  enrollmentData.pData.description || '',
        // proof_payment:  enrollmentData.pData.proof_payment || '',
      })

      this.selectedLevel = enrollmentData.eData.grade_level || ''

      if (this.enrollmentDetails.valid) {
        this.enrollmentDetails.markAsPristine();
      }
    }
}

  submitPData() {
    this.conn.personalDetails(this.personalInfoForm.value).subscribe((result: any) => {
      console.log(result);
      
      // Update local storage with the new personal details
      const updatedStudentData = {
        ...this.studentDetails,
        ...this.personalInfoForm.value,
      };
      localStorage.setItem('student', JSON.stringify({ student: updatedStudentData }));

      // Update the student details in the component
      this.studentDetails = updatedStudentData;
      this.studentName = `${updatedStudentData.fname} ${updatedStudentData.mname} ${updatedStudentData.lname}`;
      
      // Optionally, you can also patch the form again to reflect the changes
      this.personalInfoForm.patchValue(updatedStudentData);
    });
  }

  submitEData() {
    this.conn.enrollmentDetails(this.enrollmentDetails.value).subscribe((result: any) => {
        console.log(result);
        
        // Retrieve existing data from local storage
        const existingData = JSON.parse(localStorage.getItem('studentData') || '{}');

        // Update the enrollment data
        const updatedEnrollmentData = {
            ...existingData.eData, // Keep existing enrollment data
            ...this.enrollmentDetails.value, // Merge with new enrollment data
        };

        // Store the updated data back in local storage
        localStorage.setItem('studentData', JSON.stringify({ eData: updatedEnrollmentData, pData: existingData.pData }));

        // Update the component's state
        this.eDetails = updatedEnrollmentData;

        // Optionally, you can also patch the form again to reflect the changes
        this.enrollmentDetails.patchValue(updatedEnrollmentData);
    });
}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFile = input.files[0];
    }
  }

  submitProofOfPayment() {
    const formData = new FormData();
    formData.append('LRN', this.studentDetails.LRN);
    formData.append('amount_paid', this.paymentDetails.get('amount_paid')?.value ?? ''); // Provide a default value
    formData.append('proof_payment', this.selectedFile); // Ensure selectedFile is a Blob or File
    formData.append('description', this.paymentDetails.get('description')?.value ?? ''); // Provide a default value
  
    this.conn.uploadPayment(formData).subscribe(
      (response) => {
        const existingData = JSON.parse(localStorage.getItem('studentData') || '{}'); // Retrieve existing data

        // Update the payment data
        const updatedPaymentData = {
          ...existingData.pData, // Keep existing payment data
          amount_paid: this.paymentDetails.get('amount_paid')?.value ?? '', // Add the new amount_paid
          description: this.paymentDetails.get('description')?.value ?? '', // Add the new description
        };

        // Store the updated data back in local storage
        localStorage.setItem('studentData', JSON.stringify({ eData: existingData.eData, pData: updatedPaymentData }));

        this.pDetails = updatedPaymentData; // Update pDetails if you have it

        console.log(response);
      },
      (error) => {
          this.uploadMessage = 'Upload failed. Please try again.';
      }
    );
  }

  isPaymentApproved(): boolean {
    return this.eDetails?.payment_approval !== null;
  }

  
}
