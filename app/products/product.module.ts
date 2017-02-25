import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductDetailGuard } from './product-guard.service';
import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';
import { ProductEditComponent } from './product-edit.component';

import { SharedModule } from '../shared/shared.module';

import { ProductFilterPipe } from './product-filter.pipe';
import { ProductService } from './product-mock.service';
import { ProductRoutingModule  } from './product-routing.module';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ProductData }  from './product-data';


@NgModule({
  imports: [
    SharedModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    InMemoryWebApiModule.forRoot(ProductData),
  ],
  declarations: [
    ProductFilterPipe,
    ProductListComponent,
    ProductDetailComponent,
    ProductEditComponent
  ],
  providers: [
    ProductService,
    ProductDetailGuard
  ]
})
export class ProductModule {}
