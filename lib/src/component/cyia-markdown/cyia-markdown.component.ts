/// <reference types="monaco-editor" />
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import * as monaco from 'monaco-editor';
import { Subscription } from 'rxjs';
import { importScript } from 'cyia-ngx-common';
import { EDITOR_OP } from 'lib/src/symbol/editor.symbol';
import { WrapType, StartType, MultiStartType } from 'lib/src/type/editor.type';
import { repeat } from 'rxjs/operators';
// declare 
// const monaco = require('monaco-editor')
let loadedMonaco = false;
let loadPromise: Promise<void>;
// declare let monaco
@Component({
  selector: 'cyia-markdown',
  templateUrl: './cyia-markdown.component.html',
  styleUrls: ['./cyia-markdown.component.scss']
})
export class CyiaMarkdownComponent implements OnInit {
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
  @ViewChild('container', { static: true }) container: ElementRef<HTMLDivElement>





  constructor() { }

  ngOnInit() {
    console.log(this.container);
    console.log('测试')
    // importScript('vs/loader.js').then(async (value) => {
    //   console.log(value)

    //   await importScript('vs/editor/editor.main.nls.js')
    //   await importScript('vs/editor/editor.main.js')
    //   setTimeout(() => {
    //     console.log(window['monaco'])

    //   }, 1000);
    // })

    this.instance = monaco.editor.create(this.container.nativeElement, {
      language: 'markdown',
      minimap: { enabled: false },
      // automaticLayout: true
    })
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
  buttonEnter(property: string) {
    console.log('进入')
    this.flag[property] = true
  }
  buttonLeave(property: string) {
    console.log('离开')
    this.flag[property] = false
  }
}
