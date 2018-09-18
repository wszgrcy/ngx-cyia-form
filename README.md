# 简介
- 将现有对象转化为FormGroup对象用于表单验证
- 目前可以设置字段名+类型(对象,数组,普通数值)的字段验证(内置+自定义)和是否禁用

# 方法
- `object2Form(object)` 直接传入对象返回FormGroup对象
- `setValidatorList(list,customList)` list是验证器列表,customList是自定义的验证器函数列表
> list写法 
``` ts
export interface validatorConfig {
  /**验证的字段名 */
  name: string;
  /**验证器列表 */
  validatorList?: validatorItem[];
  /**字段类型(数组,对象,装对象的数组) */
  type?: formPropertyType;
  disable?: boolean;
}

```
# 使用
``` ts 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CyiaFormModule } from 'ngx-form';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CyiaFormModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```
``` ts
{
    constructor(private service: CyiaFormService) {}
     ngOnInit(): void {
       this.service.setValidatorList(testValidatorArray, [customValidator])
       let tform = this.service.object2Form(testObj)
     }
}
/**自定义写法 */
function customValidator(a, b): ValidatorFn {
  return (c: AbstractControl) => {
    return { '测试错误': true }
  }
}
const testObj = {
  int: 1,
  string: '2',
  string2: '324',
  obj: {
    obj1: 1,
    obj2: '2'
  },
  array1no: [1, 2, 3],
  array2: [{ a1: 1 }, { a2: 2 }],
  array3: [[[456]]]
}
const testValidatorArray: validatorConfig[] = [
  { name: 'int', validatorList: [{ name: 'required', value: true }, { name: 'email', value: true }] },
  { name: 'string', validatorList: [{ name: 'required', value: true }], disable: true },
  { name: 'string2', validatorList: [{ name: 'maxLength', value: 1 }, { name: 'customValidator', value: [9, 2] }] }
]
```

# 注意事项
- 目前由于设计原因没有考虑数组和对象的禁用,也就是说仅仅有能由控件输入值的验证,如果有这方面的需要,请自行添加
- 自定义验证器的value被认为是一个数组,哪怕是一个参数
- 模块中已导出FormsModule和ReactiveModule
# 更新日志

## 1.1.0
- 更新编译方式
## 1.0.9
- 增加了新的表单生成方式
- 
## 1.0.8
- 增加初始化值函数用于把值传入配置中
# todo 
## 单元测试
- 英文版...由于英文水平一般,就不献丑了,如果有大牛能帮忙翻译下,感激不禁

# 反馈
- 邮箱wszgrcy@gmail.com,如果有问题,bug或建议请发送到这里来