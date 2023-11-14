import * as OBC from 'openbim-components';

export class ProgramGenerator extends OBC.Component<string> implements OBC.UI {
  enabled = true;
  uiElement = new OBC.UIElement<{
    main: OBC.Button;
    text: OBC.TextArea;
    window: OBC.FloatingWindow;
    button: OBC.Button;
  }>();

  constructor(components: OBC.Components) {
    super(components);

    const main = new OBC.Button(components);
    main.materialIcon = 'psychology';
    main.tooltip = '容積率判定プログラムを生成します。';
    main.onClick.add(() => this.switchVisibility());
    const mainwindow = new OBC.FloatingWindow(components);
    components.ui.add(mainwindow);
    mainwindow.title = '容積率判定プログラム生成';
    mainwindow.visible = true;
    mainwindow.domElement.style.height = '250px';
    mainwindow.domElement.style.left = '430px';
    const textArea = new OBC.TextArea(components);
    textArea.label = '';
    textArea.placeholder = 'OpenAPIのレスポンスがここに表示されます。';
    textArea.enabled = true;
    mainwindow.addChild(textArea);
    const button = new OBC.Button(components);
    button.label = '生成';
    button.domElement.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    button.domElement.style.borderRadius = '4px';
    button.onClick.add(() => this.generate());
    mainwindow.addChild(button);
    this.uiElement.set({ main, text: textArea, window: mainwindow, button });
  }

  get() {
    return 'program-generator';
  }

  private switchVisibility() {
    this.uiElement.get('window').visible = !this.uiElement.get('window').visible;
  }

  private generate() {
    const textArea = this.uiElement.get('text') as OBC.TextArea;
    textArea.value = '生成中……';
    this.uiElement.get('button').enabled = true;
    fetch(`api/law/building-standards/chat?key=floorAreaRatio`)
      .then((res) => res.text())
      .then((results) => {
        textArea.value = results;
      })
      .catch(console.error);
    this.uiElement.get('button').enabled = false;
  }
}
