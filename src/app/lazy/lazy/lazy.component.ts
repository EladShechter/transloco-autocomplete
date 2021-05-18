import { Component, Inject, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import translations from '../../../assets/i18n/admin-page/en';
import { TRANSLOCO_KEYS } from '../../transloco-keys.service';

@Component({
  selector: 'app-lazy',
  templateUrl: './lazy.component.html',
  styleUrls: ['./lazy.component.css']
})
export class LazyComponent implements OnInit {
  constructor(private service: TranslocoService,
              @Inject(TRANSLOCO_KEYS) public translationKeys: typeof translations) {}

  ngOnInit() {
    console.log(this.translationKeys);
    this.service
      .load('admin-page/en')
      .subscribe(() => console.log(this.service
        .translate(this.translationKeys.title)));
  }
}
