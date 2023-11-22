import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { AdminComponent } from './admin/admin.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { Page404Component } from './page404/page404.component';
import { RobotVerificationComponent } from './robot-verification/robot-verification.component';
import { BlockUserGuard } from './block-user.guard';

const routes: Routes = [
  { path: 'robot-verification', component: RobotVerificationComponent },
  { path: '', component: HomeComponent, canActivate: [BlockUserGuard] },
  { path: 'cart', component: CartComponent, canActivate: [BlockUserGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [BlockUserGuard] },
  { path: 'error404', component: Page404Component },
  {
    path: 'product/:id',
    component: ProductDetailComponent,
    canActivate: [BlockUserGuard],
  },
  { path: '**', redirectTo: 'error404', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
