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


const CodeEditor = ({ setTheme }) => {
  const monacoRef = useRef(null);
  const editorRef = useRef();

  const [value, setValue] = useState('const x = 5;');

  const [darkPlus, setDarkPlus] = useState(null);

  console.log('darkPlus: ', darkPlus);

  useEffect(() => {
    const theme = {
      ...convertTheme(darkPlusTheme),
      inherit: true,
    };

    setDarkPlus(theme);
    // hook to get access to theme
    setTheme(theme);
  }, [setTheme]);

  useEffect(() => {
    console.log('running hook...');
    if (darkPlus && monacoRef.current) {
      console.log('defining theme, theme: ', darkPlus);
      monacoRef.current.editor.defineTheme('dark-plus', darkPlus);

      // liftOff(monacoRef.current).then(() => {
      //   // monaco.editor.setModelLanguage(editor.getModel(), "c++");
      //   monacoRef.current.editor.setTheme("dark-plus");
      // });
    }
  }, [darkPlus, monacoRef]);

  const onButtonClick = () => {
    if (darkPlus && monacoRef.current) {
      // console.log('defining theme, theme: ', darkPlus);
      // monacoRef.current.editor.defineTheme('dark-plus', darkPlus);

      liftOff(monacoRef.current).then(() => {
        console.log('setting theme...');
        // monaco.editor.setModelLanguage(editor.getModel(), "c++");
        monacoRef.current.editor.setTheme("dark-plus");
      });
    }
  };

  const liftOff = async(monaco) => {
    // map of monaco "language id's" to TextMate scopeNames
    const grammars = new Map();

    grammars.set('css', 'source.css');
    grammars.set('html', 'text.html.basic');
    grammars.set('typescript', 'source.ts');

    await wireTmGrammars(monaco, registry, grammars);
  };


  const onEditorMount = (editor, monaco) => {
    monacoRef.current = monaco;
    editorRef.current = editor;

    console.log('monacoRef.current: ', monacoRef.current);

    // liftOff(monaco).then(() => {
    //   // monaco.editor.setModelLanguage(editor.getModel(), "c++");
    //   monaco.editor.setTheme("dark-plus");
    // });

  };

  const onEditorChange = (value, event) => {
    console.log('on change called');
    setValue(value);
  };

  return (
    <div id="monaco-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '50%', border: '1px solid red' }}>
      <button onClick={() => onButtonClick()}>Set Theme</button>
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
