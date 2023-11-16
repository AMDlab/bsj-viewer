# bSJ Viewer
IFC Viewer 兼 自動審査システムプロトタイプ

### 判定プログラムの生成

https://github.com/AMDlab/bsj-viewer/assets/25860930/d8760f60-5d6c-49b8-9ae9-e1e6f8670416

### 居室の天井高さチェック
審査用にbSJの定義したパラメータを持つIFCを利用する必要があります。
IFCファイルをお持ちで無い場合は[こちらのファイル](https://github.com/AMDlab/bsj-viewer/blob/main/public/example.ifc)を使って試してください。

https://github.com/AMDlab/bsj-viewer/assets/25860930/7ad04c38-87d1-4ac7-b9f0-f6bc5047d689

## Run Application
### Crate Enviroment Variable
Copy `.env.example` and name it as `.env.local`, then modify the values in the file.

You have to prepare the API key of Open API to use LLM function.
If you use just only IFC viewer, you don't need the API key.

```bash
cp .env.example .env.local
```

### Run the development server
Use Yarn to run application.

```bash
yarn dev
```
