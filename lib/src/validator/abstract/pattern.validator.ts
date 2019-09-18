import { ValidatorFn, FormControl } from '@angular/forms';

export function patternValidator(pattern: RegExp, key: string, message: string): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
        if (control.value == null) return null
        if (!pattern.test(control.value)) {
            return { [key]: message }
        }
    };
}
