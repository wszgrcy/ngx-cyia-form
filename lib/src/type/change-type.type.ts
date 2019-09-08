import { _CyiaFormControl } from '../form/cyia-form.class';

export interface CyiaFormControlChange {
    type: keyof _CyiaFormControl
    value: any
    target?: any
}