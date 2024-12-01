import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule, Router } from '@angular/router';
import { PortalService } from '../portal.service';
import { AdmissionRequirementsComponent } from '../admission-requirements/admission-requirements.component';
import { EnrollmentProceduresComponent } from '../enrollment-procedures/enrollment-procedures.component';


@Component({
    selector: 'app-login',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  sid: any;

  constructor(
    private conn: PortalService,
    private route: Router,
    private dialog: MatDialog
  ) {}

  loginForm = new FormGroup({
    email: new FormControl(null),
    password: new FormControl(null)
  });

  onSubmit(){
    console.log('Form Submitted', this.loginForm.value);
    this.conn.enrollmentLogin(this.loginForm.value)
        .subscribe((result: any) => {
        if(result.token !=null){
          // this.conn.saveToken(result.token);
          localStorage.setItem('token', result.token);
          localStorage.setItem('student', JSON.stringify(result));

          const lrn = result.student.LRN;
          localStorage.setItem('LRN', JSON.stringify(lrn));
          this.sid = lrn;
        
          
          // console.log(this.conn.getCookie('token'))

          this.conn.getStudentEnrollment(this.sid).subscribe((result:any)=> {
            localStorage.setItem('studentData', JSON.stringify(result));

            this.route.navigate(['/registration'])
          })

          
          
        }    
      })
    
    
  }
  
  openAdmissionRequirementsDialog(): void {
    this.dialog.open(AdmissionRequirementsComponent);
  }

  openEnrollmentProceduresDialog(): void {
    this.dialog.open(EnrollmentProceduresComponent);
  }
}
