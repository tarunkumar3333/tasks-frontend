import { Component, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private fb: FormBuilder,
    private router: Router,
    private service: AuthService,
    private _ngZone: NgZone) { }
    
    ngOnInit(): void{
      // @ts-ignore
      window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
      client_id: '',
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true
      });
      // @ts-ignore
      google.accounts.id.renderButton(
      // @ts-ignore
      document.getElementById("buttonDiv"),
      { thene: "outline", size: "large", width: "100%" }
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
      };
      }

      async handleCredentialResponse(response: CredentialResponse) {
        await this.service.LoginWithGoogle(response.credential).subscribe(
        (x: any) => {

        localStorage.setItem("token", x.token);
        console.log(x.token);
        this ._ngZone.run(() => {
        this.router.navigate(['/loggedIn']);
        })}
        
        );
}
}