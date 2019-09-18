import { ValidatorFn, FormControl } from '@angular/forms';
import { patternValidator } from './abstract/pattern.validator';

export function UrlValidator(key = 'url', message = 'url验证失败'): ValidatorFn {
    return patternValidator(/^https?:\/\/.+/, key, message)
}
