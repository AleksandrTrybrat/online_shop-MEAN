import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { AdminComponent } from './admin/admin.component';
import { ProductCardComponent } from './home/product-card/product-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartService } from './cart.service';
import { CartIconComponent } from './cart-icon/cart-icon.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DeleteProductModalComponent } from './delete-product-modal/delete-product-modal.component';
import { HeaderComponent } from './UI/header/header.component';
import { FooterComponent } from './UI/footer/footer.component';
import { Page404Component } from './page404/page404.component';

import { RobotVerificationComponent } from './robot-verification/robot-verification.component';
import { CurrencySelectionComponent } from './currency-selection/currency-selection.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivityTrackerService } from './activity-tracker.service';
import { UserService } from './user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CartInfoService } from './cart-info.service';
import { OrderModalComponent } from './cart/order-modal/order-modal.component';

import { BlockUserGuard } from './block-user.guard';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CartComponent,
    AdminComponent,
    ProductCardComponent,
    ProductDetailComponent,
    CartIconComponent,
    DeleteProductModalComponent,
    HeaderComponent,
    FooterComponent,
    Page404Component,
    OrderModalComponent,
    CurrencySelectionComponent,
    RobotVerificationComponent,
    CaptchaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    FormsModule,
    ModalModule.forRoot(),
    MatSnackBarModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    CartService,
    CartInfoService,
    ActivityTrackerService,
    UserService,

    BlockUserGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
