import { Subject } from 'rxjs';
import { CyiaFormControlChange } from '../type/change-type.type';
import { CHANGE_PROPERTY_SYMBOL } from '../symbol/change-property.symbol';

export function ChangeEmit() {
    return function (target, key) {
        // console.log(target)
        let list: any[] = target.constructor[CHANGE_PROPERTY_SYMBOL] || [];
        list.push(key);
        target.constructor[CHANGE_PROPERTY_SYMBOL] = list;
    }
}