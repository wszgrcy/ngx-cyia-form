/// <reference types="monaco-editor" />
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import * as monaco from 'monaco-editor';
import { Subscription } from 'rxjs';
import { importScript } from 'cyia-ngx-common';
import { EDITOR_OP } from 'lib/src/symbol/editor.symbol';
import { WrapType, StartType } from 'lib/src/type/editor.type';
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
  flag = {
    quote: false
  }
  instance: monaco.editor.IStandaloneCodeEditor
  readonly WRAP_GROUP: { [name: string]: string } = {
    [WrapType.bold]: '**',
    [WrapType.format_italic]: '*',
    [WrapType.delete]: '~~'
  }
  readonly START_GROUP = {
    [StartType.format_quote]: '>'
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
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      // let editor = monaco.editor
      // editor.create(this.container.nativeElement, {
      //   language: 'markdown'
      // })
    }, 0);
  }
  initMonaco() {

  }
  format(type, subType: WrapType) {
    switch (type) {
      case 'wrap':
        this.wrap(subType)
        break;

      default:
        break;
    }
  }
  wrap(type: WrapType) {
    let wrapText = this.WRAP_GROUP[type]
    let selection = this.instance.getSelection().clone()
    this.instance.executeEdits(EDITOR_OP.BOLD, [{ range: new monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn), text: wrapText }])
    this.instance.executeEdits(EDITOR_OP.BOLD, [{ range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.startLineNumber, selection.startColumn), text: wrapText }])
    if (selection.startColumn == selection.endColumn &&
      selection.endLineNumber == selection.startLineNumber) {
      this.instance.setSelection({ startLineNumber: selection.startLineNumber, startColumn: selection.startColumn + wrapText.length, endLineNumber: selection.startLineNumber, endColumn: selection.startColumn + wrapText.length })
    } else {
      this.instance.setSelection({ startLineNumber: selection.endLineNumber, startColumn: selection.endColumn + wrapText.length * 2, endLineNumber: selection.endLineNumber, endColumn: selection.endColumn + wrapText.length * 2 })
    }
    this.instance.focus()
  }
  formatStart(type: StartType.format_quote) {

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
