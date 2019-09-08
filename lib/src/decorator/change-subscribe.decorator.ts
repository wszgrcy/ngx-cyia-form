import { CHANGE_PROPERTY_SYMBOL } from '../symbol/change-property.symbol';
import { Subject } from 'rxjs';
import { CyiaFormControlChange } from '../type/change-type.type';

export function ChangeSubscribe() {
    return function (target: Function['prototype'], key: string, descriptor: PropertyDescriptor) {
        // let fn = descriptor.value;
        let list: string[] = target.constructor[CHANGE_PROPERTY_SYMBOL]
        descriptor.value = function () {
            let subject = new Subject<CyiaFormControlChange>()
            list.forEach((str) => {
                let value = this[str]
                Object.defineProperty(this, str, {
                    set: (val) => {
                        if (value !== val) {
                            value = val;
                            subject.next({ type: str as any, value: val })
                        }
                    }, get: () => value
                })

            })
            // return fn()
            return subject
        }
    }
}