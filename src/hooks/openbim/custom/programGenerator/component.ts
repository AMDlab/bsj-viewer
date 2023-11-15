import { promptMapping } from '@/const/law';
import * as OBC from 'openbim-components';

export class ProgramGenerator extends OBC.Component<string> implements OBC.UI {
  enabled = true;
  private _selectedKey: string = 'floorAreaRatio';
  uiElement = new OBC.UIElement<{
    main: OBC.Button;
    text: OBC.TextArea;
    window: OBC.FloatingWindow;
    button: OBC.Button;
    selector: OBC.Dropdown;
  }>();

  constructor(components: OBC.Components) {
    super(components);

    const main = new OBC.Button(components);
    main.materialIcon = 'psychology';
    main.tooltip = '審査用プログラムを生成します。';
    main.onClick.add(() => this.switchVisibility());

    const mainwindow = new OBC.FloatingWindow(components);
    components.ui.add(mainwindow);
    mainwindow.title = '審査プログラム生成';
    mainwindow.visible = false;
    mainwindow.domElement.style.height = '400px';
    mainwindow.domElement.style.left = '430px';
    mainwindow.children[0].domElement.style.height = '100%';

    const selector = new OBC.Dropdown(components);
    selector.addOption(...Object.keys(promptMapping));
    selector.value = this._selectedKey;
    selector.onChange.add((data) => {
      this._selectedKey = data;
    });
    const options = selector.domElement.children[2] as any;
    options.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    options.style.color = 'black';
    console.log();
    mainwindow.addChild(selector);

    const textArea = new OBC.TextArea(components);
    textArea.label = '';
    textArea.placeholder = 'OpenAIのレスポンスがここに表示されます。';
    textArea.enabled = false;
    mainwindow.addChild(textArea);

    const button = new OBC.Button(components);
    button.label = '生成';
    button.domElement.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    button.domElement.style.borderRadius = '4px';
    button.domElement.style.cursor = 'pointer';
    button.domElement.style.marginLeft = 'auto';
    button.onClick.add(() => this.generate());
    mainwindow.addChild(button);

    this.uiElement.set({ main, text: textArea, window: mainwindow, button, selector });
  }

  get() {
    return 'program-generator';
  }

  private switchVisibility() {
    this.uiElement.get('window').visible = !this.uiElement.get('window').visible;
  }

  private generate() {
    alert('生成を開始します。');
    const textArea = this.uiElement.get('text') as OBC.TextArea;
    textArea.value = '生成中…';
    this.uiElement.get('button').enabled = true;
    fetch(`api/law/building-standards/generate-program?key=${this._selectedKey}`)
      .then((res) => res.json())
      .then((result) => {
        textArea.value = result.message.choices[0].message.content;
      })
      .catch(console.error);
  }
}
