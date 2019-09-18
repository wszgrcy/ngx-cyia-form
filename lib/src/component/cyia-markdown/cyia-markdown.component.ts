/// <reference types="monaco-editor" />
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Sanitizer } from '@angular/core';
import * as monaco from 'monaco-editor';
import { Subscription } from 'rxjs';
import { importScript } from 'cyia-ngx-common';
import { EDITOR_OP } from 'lib/src/symbol/editor.symbol';
import { WrapType, StartType, MultiStartType } from 'lib/src/type/editor.type';
import { repeat, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { InsertImageComponent } from './insert/insert-image/insert-image.component';
import { InsertUrlComponent } from './insert/insert-url/insert-url.component';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import md from "markdown-it";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// declare 
// const monaco = require('monaco-editor')
// let loadedMonaco = false;
// let loadPromise: Promise<void>;
// declare let monaco
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
  readonly editorBarPrefix = 'editor-bar-'
  flag = {
    quote: false
  }
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
  @ViewChild('container', { static: false }) container: ElementRef<HTMLDivElement>

  disabled: Boolean = true
  value: string = ''
  readValue: SafeHtml
  constructor(
    private matDialog: MatDialog,
    private cd: ChangeDetectorRef,
    private domSanitizer: DomSanitizer

  ) { }
  writeValue(value) {
    if (typeof value == 'string') {
      this.value = value
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
    console.log(this.container);
    console.log('测试')
    if (this.disabled) {
      this.initRead()
    } else {
      this.initWrite()
    }

    // this.instance = monaco.editor.create(this.container.nativeElement, {
    //   language: 'markdown',
    //   minimap: { enabled: false },
    //   // automaticLayout: true
    // })
  }
  ngAfterViewInit(): void {

  }
  initMonaco() {

  }
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
    console.log(selection.startColumn)
    console.log(selection.endLineNumber)
    if (selection.startColumn !== 1) {
      this.instance.executeEdits(`${this.editorBarPrefix}divider`, [{ range: new monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn), text: '\n\n---  \n' }])
      this.instance.setSelection(monaco.Selection.createWithDirection(selection.startLineNumber + 3, 1, selection.endLineNumber + 3, 1, 0))
    } else {
      this.instance.executeEdits(`${this.editorBarPrefix}divider`, [{ range: new monaco.Range(selection.endLineNumber, 1, selection.endLineNumber, 1), text: '\n---  \n' }])
      this.instance.setSelection(monaco.Selection.createWithDirection(selection.startLineNumber + 2, selection.startColumn, selection.endLineNumber + 2, selection.endColumn, 0))
    }

    this.instance.focus()
  }
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
    this.insert(res)
  }
  insert(value: string) {
    let selection = this.instance.getSelection().clone()
    this.instance.executeEdits(`${this.editorBarPrefix}image`, [{ range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn), text: value }])
    this.instance.setSelection({ startLineNumber: selection.startLineNumber, startColumn: selection.startColumn, endLineNumber: selection.endLineNumber, endColumn: selection.endColumn + value.length })
    this.instance.focus()
  }

  save() {
    this.notifyValueChange(this.instance.getValue())
  }
  /**
   * 只读时初始化渲染
   *
   * @memberof CyiaMarkdownComponent
   */
  initRead() {
    this.readValue = this.domSanitizer.bypassSecurityTrustHtml(md({ html: true }).render(this.value))
  }
  initWrite() {
    this.instance = this.instance || monaco.editor.create(this.container.nativeElement, {
      language: 'markdown',
      minimap: { enabled: false },
      // automaticLayout: true
    })
  }
  switchPattern() {
    this.disabled = !this.disabled;
    if (this.disabled) {
      this.initRead()
    } else {
      this.initWrite()
    }
    this.cd.markForCheck()
  }
}
