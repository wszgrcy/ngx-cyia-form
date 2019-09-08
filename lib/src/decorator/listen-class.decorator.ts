import { CHANGE_PROPERTY_SYMBOL } from '../symbol/change-property.symbol'

export function ListenClass() {
    return function (constructor) {
        return class extends constructor {
            constructor(...args) {
                super(...args)
                console.dir(constructor)
                constructor[CHANGE_PROPERTY_SYMBOL]
                console.log(this)
            }

        }
    }
}