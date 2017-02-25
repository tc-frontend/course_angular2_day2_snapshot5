import { Component, OnInit } from '@angular/core'
import { IProduct} from './product'
import { ProductService } from './product-mock.service'

@Component({
    selector: 'pm-products',
    moduleId: module.id,
    templateUrl: 'product-list.component.html',
    styleUrls: [ 'product-list.component.css']
}) 
export class ProductListComponent implements OnInit   {
    pageTitle: string = 'Product List';
    imageWith: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    listFilter: string;
    errorMessage: string;
    products: IProduct[] ;
    constructor(private _productService: ProductService){
    }

    toggleImage(): void { 
        this.showImage = !this.showImage; 
    }

    ngOnInit(): void {
        this._productService.getProducts()
         .subscribe(products =>this.products = products, 
                    error=> this.errorMessage = <any>error) ;
    }

    onRatingCicked(message: string):void{
        this.pageTitle = 'Product List:' + message;
    }

}