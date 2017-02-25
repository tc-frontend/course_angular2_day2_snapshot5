import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router  } from '@angular/router';


import { IProduct } from './product';
import { ProductService } from './product-mock.service';
import { NumberValidators } from '../shared/number.validator';
import {  StringValidators } from '../shared/string.validator';
import { FormUtils } from '../shared/formUtils';
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/debounceTime'

@Component({
    templateUrl: 'app/products/product-edit.component.html'
})
export class ProductEditComponent implements OnInit, OnDestroy {
 
    pageTitle: string = 'Product Edit';
    errorMessage: string;
    product: IProduct;
    private sub: Subscription;
    mode: string;
    productForm: FormGroup;
    isLoading: boolean = false;
    private validationMessages: { [key: string]: { [key: string]: string } };
    displayMessages: Object = {};

    constructor( private route: ActivatedRoute,
                private router: Router,
                private productService: ProductService,
                private fb: FormBuilder) {
        this.validationMessages = {
            productName: {
                required: 'Product name is required.',
                minlength: 'Product name must be at least three characters.',
                maxlength: 'Product name cannot exceed 50 characters.'
            },
            productCode: {
                required: 'Product code is required.',
            },
            confirmProductCode: {
                required: 'Product code is required.'
            },
            codeGroup:{
                match: 'The confirmation does not match the producto code.'
            },
            starRating: {
                range: 'Rate the product between 1 (lowest) and 5 (highest).'
            },
            quantity: {
                numeric: "The quantity must be numeric."
            },
            outOfStockReason: {
                required: 'The reason is required.'
            },
            
        };

       
    }
    ngOnInit(): void {
        this.productForm = this.fb.group({
            productName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            codeGroup: this.fb.group({
                productCode:  ['', Validators.required],
                confirmProductCode: ['', Validators.required],
            }, {validator: StringValidators.controlValueMatcher('productCode', 'confirmProductCode')}),
            starRating: ['', NumberValidators.range(1,5)],
            tagGroup: this.fb.group({
                tag: ''
            }),
            description: '',
            availability: 'available',
            outOfStockReason: ['', Validators.required],
            quantity: [0, [Validators.maxLength(8), Validators.pattern("^(0|[1-9][0-9]*)$")]]
        });

    
        this.subscribeToChanges();

  
        // Read the product Id from the route parameter
        this.sub = this.route.params.subscribe(
            params => {
                let id = +params['id'];
                this.getProduct(id);
            }
        );
    }
 
    changeAvailability(type: string): void{
        const reasonForm= this.productForm.get('outOfStockReason');

        if(type === "outofstock"){
            reasonForm.setValidators(Validators.required);
        } else {
            reasonForm.clearValidators();
        }

        reasonForm.updateValueAndValidity()
    }

    subscribeToChanges():void {
      this.productForm.get('availability').valueChanges
            .subscribe(value=>this.changeAvailability(value));

     var controlsWithValidations = FormUtils.getValidationControls(this.productForm);
 
      Object.keys(controlsWithValidations).map(key=>{
            let control = controlsWithValidations[key];
            if(control){
                let changes = control.valueChanges;
                if(key==="codeGroup"){
                    changes = changes.debounceTime(700);
                }
                changes.subscribe(valueUpdated=>{
                        let ignoreDirtyAndTouch = (key==="outOfStockReason" || key ==="codeGroup");
                        if(control instanceof FormGroup){
                            let hasChildrenError = false;
                            Object.keys(valueUpdated).map(childKey=>{
                                if(valueUpdated[childKey]!==null){
                                    let childControl = this.productForm.get(key + "." + childKey)
                                    if(childControl){
                                        const result = this.setMessage(childKey, childControl);
                                        if(!hasChildrenError && result){
                                            hasChildrenError = true
                                        }
                                    }
                                }
                                
                            })
                            if(!hasChildrenError){
                                this.setMessage(key, control, ignoreDirtyAndTouch);
                            }
                        } else{
                            this.setMessage(key, control, ignoreDirtyAndTouch);
                        }
                      
                        
                    });
            }
            
      })
    }

    setMessage(name: string, control: AbstractControl, ignoreDirtyAndTouch: boolean = false){        
        if (this.validationMessages[name]) {
            let userInteracionValidation = true;
        
            if(!ignoreDirtyAndTouch) {
                userInteracionValidation = (control.dirty || control.touched);
            } 
            if ( userInteracionValidation && control.errors) {
                this.displayMessages[name] = '';
                Object.keys(control.errors).map(messageKey => {
                    if (this.validationMessages && this.validationMessages[name][messageKey]) {
                        this.displayMessages[name] += this.validationMessages[name][messageKey] + ' ';
                    }
                });

                return true;
            } else {
                delete this.displayMessages[name]
            }
        }

        return false;
    }

    getProduct(id: number): void {
        this.isLoading = true;
        this.productService.getProduct(id)
            .subscribe(
                (product: IProduct) => this.onProductRetrieved(product),
                (error: any) => this.errorMessage = <any>error
            );
    }

    onProductRetrieved(product: IProduct): void {
        this.product = product;
        
        this.productForm.patchValue({
            productName: product.productName,
            codeGroup:{
                productCode: product.productCode
            },
            starRating: product.starRating,
            description: product.description,
            availability: product.availability,
            outOfStockReason: product.outOfStockReason,
            quantity: product.quantity
        });
       
        this.isLoading = false;
        const confirmProductCode= this.productForm.get('codeGroup.confirmProductCode');
        if (product.id === 0) {
            this.pageTitle = 'Add Product';
            //this.product.tags = [];
            this. mode='create';
            confirmProductCode.setValidators(Validators.required);
        } else {
            this.pageTitle = `Edit Product: ${product.productName}`;
            this.mode ='edit';
            confirmProductCode.clearValidators();
        }

    }
    /*
    addTag(): void {
        if(!this.product.tags){
            this.product.tags = [];
        }
        this.product.tags.push('');
    }
    */

    deleteProduct(): void {
        if (this.product.id === 0) {
            // Don't delete, it was never saved.
            this.onSaveComplete();
       } else {
            if (confirm(`Really delete the product: ${this.product.productName}?`)) {
                this.productService.deleteProduct(this.product.id)
                    .subscribe(
                        () => this.onSaveComplete(),
                        (error: any) => this.errorMessage = <any>error
                    );
            }
        }
    }
    

    saveProduct(): void {
        if (this.productForm.dirty && this.productForm.valid) {
            // Copy the form values over the product object values
            let p = Object.assign({}, this.product, this.productForm.value);
            p.productCode = p.codeGroup.productCode;
            delete p.codeGroup;

            this.productService.saveProduct(p)
                .subscribe(
                    () => this.onSaveComplete(),
                    (error: any) => this.errorMessage = <any>error
                );
        } else if (!this.productForm.dirty) {
            this.onSaveComplete();
        }
    }

    onSaveComplete(): void {
        // Reset the form to clear the flags
        this.productForm.reset();
        this.router.navigate(['/products']);
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}