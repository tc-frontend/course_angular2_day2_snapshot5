import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { IProduct } from './product';
import { ProductService } from './product-mock.service'
import { Subscription }  from 'rxjs/Subscription'

@Component({
    templateUrl: 'app/products/product-detail.component.html'
})
export class ProductDetailComponent implements OnInit   {
    pageTitle: string = 'Product Detail';
    product: IProduct;
    sub: Subscription;
    errorMessage: string;
    
    constructor(private _route: ActivatedRoute,
                private _router: Router,
                private _productService: ProductService){

    }

    ngOnInit(): void {
        this.sub = this._route.params.subscribe(
            params => {
                let id = +params['id'];
                this.getProduct(id);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getProduct(id: number) {
        this._productService.getProduct(id).subscribe(
            product => this.product = product,
            error => this.errorMessage = <any>error);
    }

    onBack(): void{
        this._router.navigate(['/products']);
    }
}
