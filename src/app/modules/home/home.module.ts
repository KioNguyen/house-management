import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NgxMasonryModule } from 'ngx-masonry';

import { HomeComponent } from './page/home.component';

import { HomeRoutingModule } from './home.routing';
import { HouseDetailComponent } from './page/house-detail/house-detail.component';
import { HouseModelComponent } from './page/house-model/house-model.component';

@NgModule({
  declarations: [HouseModelComponent, HouseDetailComponent, HomeComponent],
  imports: [SharedModule, NgxMasonryModule, HomeRoutingModule],
  exports: [],
  providers: []
})
export class HomeModule {}
