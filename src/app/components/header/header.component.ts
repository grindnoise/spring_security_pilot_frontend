import {Component, OnInit} from '@angular/core';
import {User} from 'src/app/model/user.model';
import {KeycloakService} from "keycloak-angular";
import {KeycloakProfile} from "keycloak-js";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user = new User();

  public isUserLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;

  constructor(private readonly keycloak: KeycloakService) {
  }

  // public ngOnInit() {
  //   // Keycloak
  //   if (this.isUserLoggedIn) {
  //     this.keycloak.loadUserProfile().then(data => {
  //       this.userProfile = data;
  //       this.user.name = this.userProfile.firstName ?? "";
  //       window.sessionStorage.setItem("userdetails", JSON.stringify(this.user));
  //     });
  //   }
  //
  //   // Old way
  //   // if(sessionStorage.getItem('userdetails')){
  //   //   this.user = JSON.parse(sessionStorage.getItem('userdetails')!);
  //   // }
  // }

  public async ngOnInit() {
    this.isUserLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isUserLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
      this.user.authStatus = 'AUTH';
      this.user.name = this.userProfile.firstName || "";
      window.sessionStorage.setItem("userdetails",JSON.stringify(this.user));

    }
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    let redirectUrl: string = "http://localhost:4200/home" // this uri should be set in Keycloak: Setting->Valid post logout redirect URIs
    this.keycloak.logout(redirectUrl);
  }
}
