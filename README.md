# React-Ts-DeckGL
DeckGLでTypeScriptを使ってみる(DeckGLはUberのWebGL2対応したデータビジュアライズのライブラリ)

## 参考記事
- [Reactとdeck.glでGoogle MapタイムラインのData Visualization](https://noah.plus/blog/006/)  
上記記事を参考にカスタマイズ

## 型定義の導入手順
- [Deck.gl & TypeScriptセットアップの手順メモ](https://scrapbox.io/naotaro-studymemo/Deck.gl_&_TypeScript%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97%E3%81%AE%E6%89%8B%E9%A0%86%E3%83%A1%E3%83%A2)

## Build Setup
``` bash
# install dependencies
$ yarn

# serve with hot reload at localhost:8080
$ yarn dev

# build for production and launch server
$ yarn build

# Lint Fix
$ yarn lint
```


## Vscode設定
vscodeの場合、setting.jsonに以下の設定も忘れないこと
``` 
"eslint.validate": [
  "javascript",
  "javascriptreact",
  {
    "language": "typescript",
    "autoFix": true
  },
  {
    "language": "typescriptreact", 
    "autoFix": true 
  }
```
