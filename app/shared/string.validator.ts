import { AbstractControl, ValidatorFn } from '@angular/forms';

export class StringValidators {

    static controlValueMatcher(name1: string, name2: string): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {

            let control1 = c.get(name1);
            let control2 = c.get(name2);
            if(control1.pristine || control2.pristine){
                return null;
            }
            if(control1.value === control2.value){
                return null;
            }
            return { 'match': true };
        };
    }
}