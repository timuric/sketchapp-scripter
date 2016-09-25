'use babel';

import { CompositeDisposable } from 'atom'
import fs from 'fs'
import child_process from 'child_process'
import coscript from 'coscript'

export default {

  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'sketchapp-scripter:runScript': () => this.runScript()
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  runScript() {

    const packageDir = atom.packages.getLoadedPackage('sketchapp-scripter').path;
    let editor = atom.workspace.getActiveTextEditor();

    if(editor){
      const userCode = editor.getText();
      fs.writeFile(packageDir+'/scripting/run.sketchplugin', userCode)
      child_process.exec(coscript + ' -e "[[[COScript app:\\\"Sketch\\\"] delegate] runPluginAtURL:[NSURL fileURLWithPath:\\\"'+ packageDir +'/scripting/run.sketchplugin\\\"]]"', function (error, stdout, stderr) {
        console.log(error)
        console.log(stdout)
        console.log(stderr)
      });
    }
  }
};
