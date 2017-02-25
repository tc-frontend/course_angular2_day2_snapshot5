import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ProductDetailGuard } from './product-guard.service';
import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';
import { ProductEditComponent } from './product-edit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
        { path: 'products', component: ProductListComponent },
        { path: 'product/:id',
            canActivate: [ ProductDetailGuard],
            component: ProductDetailComponent
        },
        { path: 'productEdit/:id',
            component: ProductEditComponent },
        ])
    ],
    exports: [ RouterModule ]
})
export class ProductRoutingModule{}