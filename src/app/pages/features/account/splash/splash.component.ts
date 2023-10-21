import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent  implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
    setTimeout(()=>{
      this.router.navigate(['sign-in']);
    }, 2000)
  }

}
