import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';


@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent {
  hidePass:boolean=true
  hidePass2:boolean=true
  registerForm: FormGroup
  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      {
        lastname: ['', [Validators.required, Validators.minLength(3)]],
        firstname: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password2: ['', [Validators.required, Validators.minLength(8)]]
      }
    )
  }
  PasswordMatch():boolean{
    const pw=this.registerForm.get('password')?.value;
    const pw2=this.registerForm.get('password2')?.value;
    return pw&&pw2&&pw!==pw2
  }
  passwordVisibility(field: 'password' | 'password2'): void {
    if (field === 'password') {
      this.hidePass = !this.hidePass;
    } 
    else
    {
        this.hidePass2 = !this.hidePass2;
    }
  }
}

