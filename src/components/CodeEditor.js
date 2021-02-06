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
    grammars.set('html', 'text.html.basic');
    grammars.set('typescript', 'source.ts');

    await wireTmGrammars(monaco, registry, grammars);


  };


  const onEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    console.log('defining theme');

    monaco.editor.defineTheme('Dark+ (default dark)', {
      // ... use `monaco-vscode-textmate-theme-converter` to convert vs code theme and pass the parsed object here
      ...darkPlus,
    });

    // liftOff(monaco).then(() => {
    //   // monaco.editor.setModelLanguage(editor.getModel(), "c++");
    //   monaco.editor.setTheme("Dark+ (default dark)");
    // });

  };

  const onEditorChange = (value, event) => {
    console.log('on change called');
    setValue(value);
  };

  return (
    <div id="monaco-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '50%', border: '1px solid red' }}>
      <Editor
        value={value}
        onMount={onEditorMount}
        onChange={onEditorChange}
        language="javascript"
        height="100%"
      />
    </div>
  );
};

export default CodeEditor;
