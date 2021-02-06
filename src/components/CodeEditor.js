import React, { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { convertTheme } from 'monaco-vscode-textmate-theme-converter/lib/cjs';
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';

import darkPlusTheme from '../themes/dark_plus.json';

const registry = new Registry({
  getGrammarDefinition: async (scopeName) => {
    return {
      format: 'json',
      content: await (await fetch(`static/grammars/css.tmGrammar.json`)).text()
    };
  },
});


const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState('const x = 5;');

  const [darkPlus, setDarkPlus] = useState();

  console.log('darkPlus: ', darkPlus);

  useEffect(() => {
    setDarkPlus(convertTheme(darkPlusTheme));
  }, []);

  const liftOff = async(monaco) => {
    // map of monaco "language id's" to TextMate scopeNames
    const grammars = new Map();

    grammars.set('css', 'source.css');
    // grammars.set('html', 'text.html.basic');
    // grammars.set('typescript', 'source.ts');

    await wireTmGrammars(monaco, registry, grammars);


  };

  const editorWillMount = (monaco) => {
    // monaco.languages.register({ id: "c++" });
    monaco.editor.defineTheme('vs-code-theme-converted', {
      // ... use `monaco-vscode-textmate-theme-converter` to convert vs code theme and pass the parsed object here
      ...darkPlus,
    });
  };


  // there is no 'onChange' function we can provide to MonacoEditor wrapper. We need to use editorDidMount
  // then we can get the first parameter which is the current value of the editor
  // and the second is a reference to the editor itself.
  // we can use the editor reference to call onDidChangeModelContent to call our onChange.
  const onEditorDidMount = (getEditorValue, monacoEditor) => {
    editorRef.current = monacoEditor;

    monacoEditor.onDidChangeModelContent(() => {
      setValue(getEditorValue());
    });

    console.log('setting theme...');

    // monacoEditor.editor.defineTheme('vs-code-theme-converted', {
    //   // ... use `monaco-vscode-textmate-theme-converter` to convert vs code theme and pass the parsed object here
    //   ...darkPlus,
    // });

    liftOff(monacoEditor).then(() => {
      // monaco.editor.setModelLanguage(editor.getModel(), "c++");
      monacoEditor.editor.setTheme("vs-code-theme-converted");
    });

  };

  return (
    <div id="monaco-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '50%', border: '1px solid red' }}>
      <Editor
        value={value}
        editorWillMount={editorWillMount}
        editorDidMount={onEditorDidMount}
        language="javascript"
        height="100%"
      />
    </div>
  );
};

export default CodeEditor;
