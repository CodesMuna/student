import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PortalService } from '../portal.service';

@Component({
  selector: 'app-portal-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './portal-login.component.html',
  styleUrl: './portal-login.component.css'
})
export class PortalLoginComponent {



  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private conn: PortalService,
    private route: Router
  ) { }


  enrollmentLogin(){
    this.conn.enrollmentLogin(this.loginForm.value)
      .subscribe((result:any)=>{
        if(result.token !=null){
          // this.conn.saveToken(result.token);
          localStorage.setItem('token', result.token);
          this.route.navigate(['/main'])
          // console.log(this.conn.getCookie('token'))
        }
        console.log(result)
      })
  }
}
