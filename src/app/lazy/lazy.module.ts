import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { LazyComponent } from './lazy/lazy.component';
import { TranslocoKeysService, TRANSLOCO_KEYS } from '../transloco-keys.service';
import translations from '../../assets/i18n/admin-page/en';

const routes: Routes = [
  {
    path: '',
    component: LazyComponent
  }
];

@NgModule({
  declarations: [LazyComponent],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: 'admin-page' },
    { provide: TRANSLOCO_KEYS, useFactory: () => new TranslocoKeysService('adminPage', translations) }
  ],
  imports: [CommonModule, RouterModule.forChild(routes), TranslocoModule]
})
export class LazyModule {}
