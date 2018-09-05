
import { ModelViewPropertyConfig, componentType } from "./form.define";

export function _getConfig2Array(config: ModelViewPropertyConfig[][]) {
    let array = [];
    for (let i = 0; i < config.length; i++) {
        const element = config[i];
        array[i] = _getConfig2Object(element)
    }
    return array
}
export function _getConfig2Object(config: ModelViewPropertyConfig[]) {
    let obj = {} as any;
    for (let i = 0; i < config.length; i++) {
        const configItem = config[i];
        switch (configItem.type) {
            case componentType.ARRAY:
                obj[configItem.key || configItem.keyPath[configItem.keyPath.length - 1]] = {
                    value: _getConfig2Array(configItem.children as any),
                    disabled: configItem.disabled,
                    validatorList: configItem.validatorList
                }
                break;
            case componentType.OBJECT:
                obj[configItem.key || configItem.keyPath[configItem.keyPath.length - 1]] = {
                    value: _getConfig2Object(configItem.children as any),
                    disabled: configItem.disabled,
                    validatorList: configItem.validatorList
                }
                break;

            default:
                obj[configItem.key || configItem.keyPath[configItem.keyPath.length - 1]] = {
                    value: configItem.value,
                    disabled: configItem.disabled,
                    validatorList: configItem.validatorList
                }
                break;
        }

    }
    return obj
}