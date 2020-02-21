import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import saveIcon from '../img/save-regular.svg';
//import saveIcon from '@ckeditor/ckeditor5-basic-styles/theme/icons/italic.svg';

export default class CKSave extends Plugin {
  init() {
    const editor = this.editor;
    const t = editor.t;

    // Add bold button to feature components.
    editor.ui.componentFactory.add('save', locale => {
      const view = new ButtonView(locale);

      view.set({
        label: t('Save'),
        icon: saveIcon,
        keystroke: 'CTRL+S',
        tooltip: true,
        isToggleable: true
      });

      view.on('execute', () => {
        console.log("save");
      });
      return view;
    });
  }

}
