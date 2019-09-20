import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Sanitizer, SimpleChanges } from '@angular/core';
import * as monaco from 'monaco-editor';
import { WrapType, StartType, MultiStartType } from '../../type/editor.type';
import { repeat, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { InsertImageComponent } from './insert/insert-image/insert-image.component';
import { InsertUrlComponent } from './insert/insert-url/insert-url.component';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import md from "markdown-it";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pattern } from '../../form/cyia-form.class';
import { coerceBooleanProperty, coerceNumberProperty, coerceCssPixelValue } from '@angular/cdk/coercion';
@Component({
  selector: 'cyia-markdown',
  templateUrl: './cyia-markdown.component.html',
  styleUrls: ['./cyia-markdown.component.scss'],
  providers: [{
    useExisting: forwardRef(() => CyiaMarkdownComponent),
    provide: NG_VALUE_ACCESSOR,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CyiaMarkdownComponent implements ControlValueAccessor {
  @ViewChild('container', { static: true }) container: ElementRef<HTMLDivElement>
  @Input() pattern: Pattern = Pattern.w;
  @Input() height: string = '100px'
  readonly editorBarPrefix = 'editor-bar-'
  // flag = {
  //   quote: false
  // }
  instance: monaco.editor.IStandaloneCodeEditor
  readonly WRAP_GROUP: { [name: string]: string } = {
    [WrapType.format_bold]: '**',
    [WrapType.format_italic]: '*',
    [WrapType.delete]: '~~'
  }
  readonly START_GROUP = {
    [StartType.format_quote]: '>',
    [StartType.format_list_bulleted]: '- '
    //---
  }
  readonly MULTI_START: { [name: string]: { value: string | string[], repeat: boolean } } = {
    [MultiStartType.format_quote]: {
      value: '>', repeat: true
    },
    [MultiStartType.format_list_bulleted]: { value: '- ', repeat: true },
    [MultiStartType.format_list_numbered]: {
      value: new Array(100).fill(0).map((v, i) => `${i + 1}. `), repeat: false
    }
  }

  disabled: Boolean = false
  value: string = ''
  tempValue: string
  /**只读时 */
  readValue: SafeHtml
  /**只读模式 */
  readMode = false
  constructor(
    private matDialog: MatDialog,
    private cd: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) { }
  writeValue(value) {
    if (typeof value == 'string') {
      this.value = value
      this.tempValue = value
    }
  }
  registerOnChange(fn) {
    this.changeFn = fn;
  }
  registerOnTouched(fn) {
    this.touchedFn = fn;
  }
  private changeFn: Function = () => { };
  private touchedFn: Function = () => { };
  notifyValueChange(value: string) {
    this.changeFn(value)
    this.touchedFn(value)
  }
  setDisabledState(disabled: Boolean) {
    if (typeof disabled == 'boolean') {
      this.instance.updateOptions({ readOnly: disabled })
      this.disabled = disabled
      this.cd.markForCheck()
    }
  }
  ngOnInit() {
    if (this.pattern == Pattern.r) {
      this.initRead()
    } else if (this.pattern == Pattern.w) {
      this.initWrite()
    }

  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes)
    if (changes.pattern) {
      const pattern = changes.pattern.currentValue || changes.pattern.previousValue
      this.readMode = pattern == Pattern.w ? false : true
    }
    if (changes.height) {
      console.log(this.height)
      this.height = coerceCssPixelValue(this.height)
      console.log(this.height)
    }
  }
  /**
   * 格式化
   *
   * @author cyia
   * @date 2019-09-19
   */
  format(type: string, subType?: WrapType | StartType) {
    switch (type) {
      case 'wrap':
        this.wrap(subType as WrapType)
        break;
      case 'start':
        this.formatStart(subType as StartType)
        break
      case 'multiStart':
        this.formatMulti(subType)
        break
      case 'divider':
        this.formatDivider()
      default:
        break;
    }
  }
  wrap(type: WrapType) {
    let wrapText = this.WRAP_GROUP[type]
    let selection = this.instance.getSelection().clone()
    this.instance.executeEdits(`${this.editorBarPrefix}${type}`, [{ range: new monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn), text: wrapText }])
    this.instance.executeEdits(`${this.editorBarPrefix}${type}`, [{ range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.startLineNumber, selection.startColumn), text: wrapText }])
    if (selection.startColumn == selection.endColumn &&
      selection.endLineNumber == selection.startLineNumber) {
      this.instance.setSelection({ startLineNumber: selection.startLineNumber, startColumn: selection.startColumn + wrapText.length, endLineNumber: selection.startLineNumber, endColumn: selection.startColumn + wrapText.length })
    } else {
      // console.log(wrapText)
      this.instance.setSelection({ startLineNumber: selection.endLineNumber, startColumn: selection.endColumn + wrapText.length * 2, endLineNumber: selection.endLineNumber, endColumn: selection.endColumn + wrapText.length * 2 })
    }
    this.instance.focus()
  }

  formatStart(type: StartType) {
    let wrapText = this.START_GROUP[type]
    let selection = this.instance.getSelection().clone()
    this.instance.executeEdits(`${this.editorBarPrefix}${type}`, [{ range: new monaco.Range(selection.endLineNumber, 1, selection.endLineNumber, 1), text: wrapText }])
    this.instance.setSelection({ startLineNumber: selection.startLineNumber, startColumn: selection.startColumn + wrapText.length, endLineNumber: selection.endLineNumber, endColumn: selection.endColumn + wrapText.length })
    this.instance.focus()
  }
  formatMulti(type) {
    let obj = this.MULTI_START[type]
    let selections = this.instance.getSelections().map((selection) => selection.clone()).sort((a, b) => a.startLineNumber - b.startLineNumber)
    let list: string[] = obj.repeat ? new Array(selections.length).fill(obj.value) : obj.value as string[];
    if (list.length < selections.length) throw '选中行过长,无法添加'
    selections.forEach((selection, i) => {
      this.instance.executeEdits(`${this.editorBarPrefix}${type}`, [{ range: new monaco.Range(selection.endLineNumber, 1, selection.endLineNumber, 1), text: list[i] }])
    })

    this.instance.setSelections(selections.map((item, i) =>
      monaco.Selection.createWithDirection(item.startLineNumber,
        item.startColumn + list[i].length,
        item.endLineNumber,
        item.endColumn + list[i].length, 0)
    ))
    this.instance.focus()
  }
  formatDivider() {
    let selection = this.instance.getSelection().clone()
    if (selection.startColumn !== 1) {
      this.instance.executeEdits(`${this.editorBarPrefix}divider`, [{ range: new monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn), text: '\n\n---  \n' }])
      this.instance.setSelection(monaco.Selection.createWithDirection(selection.startLineNumber + 3, 1, selection.endLineNumber + 3, 1, 0))
    } else {
      this.instance.executeEdits(`${this.editorBarPrefix}divider`, [{ range: new monaco.Range(selection.endLineNumber, 1, selection.endLineNumber, 1), text: '\n---  \n' }])
      this.instance.setSelection(monaco.Selection.createWithDirection(selection.startLineNumber + 2, selection.startColumn, selection.endLineNumber + 2, selection.endColumn, 0))
    }

    this.instance.focus()
  }
  /**
   * 打开弹窗类的插入
   *
   * @author cyia
   * @date 2019-09-19

   */
  async open(type: string) {
    let res
    switch (type) {
      case 'image':
        res = await this.matDialog.open(InsertImageComponent).afterClosed().pipe(take(1)).toPromise()
        break;
      case 'url':
        res = await this.matDialog.open(InsertUrlComponent).afterClosed().pipe(take(1)).toPromise()
        break;
      default:
        break;
    }
    // console.log(res)
    res && this.insert(res)
  }
  insert(value: string) {
    let selection = this.instance.getSelection().clone()
    this.instance.executeEdits(`${this.editorBarPrefix}image`, [{ range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn), text: value }])
    this.instance.setSelection({ startLineNumber: selection.startLineNumber, startColumn: selection.startColumn, endLineNumber: selection.endLineNumber, endColumn: selection.endColumn + value.length })
    this.instance.focus()
  }

  /**
   * 保存按钮
   *
   * @author cyia
   * @date 2019-09-19
   */
  save() {
    this.notifyValueChange(this.instance.getValue())
    this.snackBar.open('保存成功', undefined, { duration: 2000 })
  }
  /**
   * 只读时初始化渲染
   *
   * @memberof CyiaMarkdownComponent
   */
  initRead() {
    this.readValue = this.domSanitizer.bypassSecurityTrustHtml(md({ html: true }).render(this.tempValue))
  }

  /**
   * 写入时初始化渲染
   *
   * @author cyia
   * @date 2019-09-19
   */
  initWrite() {
    this.instance = this.instance || monaco.editor.create(this.container.nativeElement, {
      language: 'markdown',
      minimap: { enabled: false },
      automaticLayout: true
    })
  }
  /**
   * 切换读写
   *
   * @author cyia
   * @date 2019-09-19
   */
  switchPattern() {
    this.pattern = this.pattern == Pattern.w ? Pattern.r : Pattern.w;
    // this.disabled = !this.disabled;
    this.tempValue = this.instance.getValue()
    if (this.pattern == Pattern.r) {
      this.initRead()
    } else if (this.pattern == Pattern.w) {
      this.initWrite()
    }
    this.cd.markForCheck()
  }
}
