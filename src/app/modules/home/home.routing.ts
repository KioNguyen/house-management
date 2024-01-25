import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guard/auth.guard';
import { HouseResolver } from './house-resolver.service';
import { HomeComponent } from './page/home.component';
import { HouseDetailComponent } from './page/house-detail/house-detail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'house/:id',
    component: HouseDetailComponent,
    canActivate: [AuthGuard],
    resolve: {
      house: HouseResolver
    }
  },
  {
    path: 'house/create',
    component: HouseDetailComponent,
    canActivate: [AuthGuard],
    resolve: {
      house: HouseResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
