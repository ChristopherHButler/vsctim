# VSCTIM - VSCODE Themes In Monaco

 - These are my notes on getting vscode themes to work in moncao.

 1. install monaco
 2. install monaco-vscode-textmate-theme-converter
 3. create the editor
 4. install monaco text-mate

 ## Notes from [monaco-vscode-textmate-theme-converter](https://github.com/Nishkalkashyap/monaco-vscode-textmate-theme-converter)

 - VSCode themes are directly not compatible with monaco-editor themes. The problem here is that vscode uses tmGrammar tokens for colorization support while monaco uses its own code editor to generate language tokens. (See more about it [here](https://github.com/Microsoft/monaco-editor/issues/675#issuecomment-363151951)).

 - You can use [monaco-textmate](https://www.npmjs.com/package/monaco-textmate) to make your monaco-editor tmGrammar compatible.

 - Once the tokens are tmGrammar compatible, you need to convert vscode generated theme data to monaco-editor compatible api. This package does exactly that.

 ## Moving on...

 5. install monaco-textmate

 ## Notes from monaco-textmate

 - monaco-textmate relies on onigasm package to provide oniguruma regex engine in browsers. onigasm itself relies on WebAssembly. Therefore to get monaco-textmate working in your browser, it must have WebAssembly support and onigasm loaded and ready-to-go.

 - so continuing on down the rabbit hole....

 6. install [Onigasm](https://www.npmjs.com/package/onigasm#light-it-up)

 following their instructions:

 - WASM must be loaded before you use any other feature like OnigRegExp or OnigScanner

 So...

 - Add wasm file to public folder and load in index file... the mount root node

... back to monaco-editor

### Using

Example below is just a demostration of available API. To wire it up with monaco-editor use [monaco-editor-textmate](https://github.com/NeekSandhu/monaco-editor-textmate).

## monaco-editor-textmate

### Limitations

 - monaco-editor distribution comes with built-in tokenization support for few languages. Because of this monaco-editor-textmate cannot be used with monaco-editor without some modification, see explanation of this problem here.

### Solution

 - To get monaco-editor-textmate working with monaco-editor, you're advised to use Webpack with monaco-editor-webpack-plugin which allows you to control which of "built-in" languages should monaco-editor use/bundle, leaving the rest. With that control you must exclude any/all languages for which you'd like to use TextMate grammars based tokenization instead.

## Back to notes...

 - Have to tried this with webpack because I used CRA to start this project.

 I feel this is close though. 

 - I also found this sandbox [https://codesandbox.io/s/gc3o2?file=/src/index.js](https://codesandbox.io/s/gc3o2?file=/src/index.js)

 To Do - continue tomorrow