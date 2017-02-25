import { FormGroup ,AbstractControl} from '@angular/forms';

export class FormUtils {

    static getValidationControls(container: FormGroup): { [key: string]: AbstractControl } {
        let controls = {};
        for (let controlKey in container.controls) {
            if (container.controls.hasOwnProperty(controlKey)) {
                let c = container.controls[controlKey];
                // If it is a FormGroup, process its child controls.
                if (c instanceof FormGroup) {
                    let childMessages = this.getValidationControls(c);
                    Object.assign(controls, childMessages);
                } 

                if(c.validator && c.validator.length>0){
                        controls[controlKey] = c;    
                }
            }
        }
        return controls;
    }
}
