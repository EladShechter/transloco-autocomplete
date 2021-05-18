import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private service: TranslocoService) { }

  ngOnInit() {
  }

  change(lang: string) {
    this.service.setActiveLang(lang);
  }

}
