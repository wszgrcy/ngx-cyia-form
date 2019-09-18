import { ValidatorFn, FormControl } from '@angular/forms';
import { patternValidator } from './abstract/pattern.validator';

export function ImageValidator(key = 'image', message = '图片地址验证失败'): ValidatorFn {
    return patternValidator(/^https?:\/\/.+/, key, message)
}
