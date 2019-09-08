export interface CyiaOption<T = any> {
    label: string
    value: T
    default?: T
    disabled?: boolean
    [name: string]: any
}