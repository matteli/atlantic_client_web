<template>
  <!-- The outermost cotainer of the editor. -->
  <div ref="ckEditor" class="ck-editor">
    <!-- The toolbar of the editor. -->
    <div class="btn-toolbar" role="toolbar" aria-label="Editor toolbar">
      <!-- The headings dropdown. -->
      <div class="btn-group mr-2" role="group" aria-label="Headings">
        <div class="dropdown" id="heading">
          <button
            class="btn btn-primary btn-sm dropdown-toggle"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span>Headings</span>
          </button>
          <div class="dropdown-menu" aria-labelledby="heading-button"></div>
        </div>
      </div>

      <!-- Basic styles buttons. -->
      <div class="btn-group mr-2" role="group" aria-label="Basic styles">
        <button type="button" class="btn btn-primary btn-sm" id="bold">B</button>
        <button type="button" class="btn btn-primary btn-sm" id="italic">I</button>
        <button type="button" class="btn btn-primary btn-sm" id="underline">U</button>
      </div>

      <!-- Undo and redo buttons. -->
      <div class="btn-group mr-2" role="group" aria-label="Undo">
        <button type="button" class="btn btn-primary btn-sm" id="undo">&larr;</button>
        <button type="button" class="btn btn-primary btn-sm" id="redo">&rarr;</button>
      </div>
    </div>

    <!-- The container with the data of the editor. -->
    <div id="editor">
      <p>Hello world!</p>
    </div>
  </div>
</template>

<script>
// Basic classes to create an editor.
import Editor from "@ckeditor/ckeditor5-core/src/editor/editor";
import EditorUI from "@ckeditor/ckeditor5-core/src/editor/editorui";
import EditorUIView from "@ckeditor/ckeditor5-ui/src/editorui/editoruiview";
import FocusTracker from "@ckeditor/ckeditor5-utils/src/focustracker";
import ComponentFactory from "@ckeditor/ckeditor5-ui/src/componentfactory";
import InlineEditableUIView from "@ckeditor/ckeditor5-ui/src/editableui/inline/inlineeditableuiview";
import HtmlDataProcessor from "@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor";
import ElementReplacer from "@ckeditor/ckeditor5-utils/src/elementreplacer";

// Interfaces to extend the basic Editor API.
import DataApiMixin from "@ckeditor/ckeditor5-core/src/editor/utils/dataapimixin";
import ElementApiMixin from "@ckeditor/ckeditor5-core/src/editor/utils/elementapimixin";

// Helper function for adding interfaces to the Editor class.
import mix from "@ckeditor/ckeditor5-utils/src/mix";

// Helper function that gets the data from an HTML element that the Editor is attached to.
import getDataFromElement from "@ckeditor/ckeditor5-utils/src/dom/getdatafromelement";

// Helper function that binds the editor with an HTMLForm element.
import attachToForm from "@ckeditor/ckeditor5-core/src/editor/utils/attachtoform";

// Basic features that every editor should enable.
import Clipboard from "@ckeditor/ckeditor5-clipboard/src/clipboard";
import Enter from "@ckeditor/ckeditor5-enter/src/enter";
import Typing from "@ckeditor/ckeditor5-typing/src/typing";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import UndoEditing from "@ckeditor/ckeditor5-undo/src/undoengine";

// Basic features associated with the edited content.
import BoldEditing from "@ckeditor/ckeditor5-basic-styles/src/bold/boldediting";
import ItalicEditing from "@ckeditor/ckeditor5-basic-styles/src/italic/italicediting";
import UnderlineEditing from "@ckeditor/ckeditor5-basic-styles/src/underline/underlineediting";
import HeadingEditing from "@ckeditor/ckeditor5-heading/src/heading/headingediting";

// The class organizing the UI of the editor, binding it with existing Bootstrap elements in the DOM.
class BootstrapEditorUI extends EditorUI {
  constructor(editor) {
    super(editor);

    // A helper to easily replace the editor#element with editor.editable#element.
    this._elementReplacer = new ElementReplacer();

    // The global UI view of the editor. It aggregates various Bootstrap DOM elements.
    const view = (this._view = new EditorUIView(editor.locale));

    // This is the main editor element in the DOM.
    view.element = this.$refs.ckEditor;

    // This is the editable view in the DOM. It will replace the data container in the DOM.
    view.editable = new InlineEditableUIView(
      editor.locale,
      editor.editing.view
    );

    // References to the dropdown elements for further usage. See #_setupBootstrapHeadingDropdown.
    view.dropdownMenu = view.element.getElementsByClassName("dropdown-menu");
    view.dropdownToggle = view.element.getElementsByClassName(
      "dropdown-toggle"
    );

    // References to the toolbar buttons for further usage. See #_setupBootstrapToolbarButtons.
    view.toolbarButtons = {};

    ["bold", "italic", "underline", "undo", "redo"].forEach(name => {
      // Retrieve the jQuery object corresponding with the button in the DOM.
      view.toolbarButtons[name] = view.element.getElementById(name);
    });
  }

  // All EditorUI subclasses should expose their view instance
  // so other UI classes can access it if necessary.
  get view() {
    return this._view;
  }

  init(replacementElement) {
    const editor = this.editor;
    const view = this.view;
    const editingView = editor.editing.view;

    // Create an editing root in the editing layer. It will correspond with the
    // document root created in the constructor().
    const editingRoot = editingView.document.getRoot();

    // The editable UI and editing root should share the same name.
    view.editable.name = editingRoot.rootName;

    // Render the editable component in the DOM first.
    view.editable.render();

    const editableElement = view.editable.element;

    // Register editable element so it is available via getEditableElement() method.
    this.setEditableElement(view.editable.name, editableElement);

    // Let the editable UI element respond to the changes in the global editor focus tracker
    // and let the focus tracker know about the editable element.
    this.focusTracker.add(editableElement);
    view.editable.bind("isFocused").to(this.focusTracker);

    // Bind the editable UI element to the editing view, making it an end– and entry–point
    // of the editor's engine. This is where the engine meets the UI.
    editingView.attachDomRoot(editableElement);

    // Setup the existing, external Bootstrap UI so it works with the rest of the editor.
    this._setupBootstrapToolbarButtons();
    this._setupBootstrapHeadingDropdown();

    // Replace the editor#element with editor.editable#element.
    this._elementReplacer.replace(replacementElement, editableElement);

    // Tell the world that the UI of the editor is ready to use.
    this.fire("ready");
  }

  destroy() {
    // Restore the original editor#element.
    this._elementReplacer.restore();

    // Destroy the view.
    this._view.editable.destroy();
    this._view.destroy();

    super.destroy();
  }

  // This method activates Bold, Italic, Underline, Undo and Redo buttons in the toolbar.
  _setupBootstrapToolbarButtons() {
    const editor = this.editor;

    for (const name in this.view.toolbarButtons) {
      // Retrieve the editor command corresponding with the ID of the button in the DOM.
      const command = editor.commands.get(name);
      const button = this.view.toolbarButtons[name];

      // Clicking the buttons should execute the editor command...
      button.click(() => editor.execute(name));

      // ...but it should not steal the focus so the editing is uninterrupted.
      button.mousedown(evt => evt.preventDefault());

      const onValueChange = () => {
        button.toggleClass("active", command.value);
      };

      const onIsEnabledChange = () => {
        button.attr("disabled", () => !command.isEnabled);
      };

      // Commands can become disabled, e.g. when the editor is read-only.
      // Make sure the buttons reflect this state change.
      command.on("change:isEnabled", onIsEnabledChange);
      onIsEnabledChange();

      // Bold, Italic and Underline commands have a value that changes
      // when the selection starts in an element the command creates.
      // The button should indicate that e.g. you are editing text which is already bold.
      if (!new Set(["undo", "redo"]).has(name)) {
        command.on("change:value", onValueChange);
        onValueChange();
      }
    }
  }

  // This method activates the headings dropdown in the toolbar.
  _setupBootstrapHeadingDropdown() {
    const editor = this.editor;
    const dropdownMenu = this.view.dropdownMenu;
    const dropdownToggle = this.view.dropdownToggle;

    // Retrieve the editor commands for heading and paragraph.
    const headingCommand = editor.commands.get("heading");
    const paragraphCommand = editor.commands.get("paragraph");

    // Create a dropdown menu entry for each heading configuration option.
    editor.config.get("heading.options").map(option => {
      // Check if options is a paragraph or a heading as their commands differ slightly.
      const isParagraph = option.model === "paragraph";

      // Create the menu item DOM element.

      const menuItem = document.createElement("a");
      menuItem.setAttribute("href", "#");
      menuItem.setAttribute(
        "class",
        "dropdown-item heading-item_" + option.model
      );
      const menuText = document.createTextNode(option.title);
      menuItem.appendChild(menuText);
      /*
      const menuItem = $(
        `<a href="#" class="dropdown-item heading-item_${option.model}">` +
          `${option.title}` +
          "</a>"
      );*/

      // Upon click, the dropdown menu item should execute the command and focus
      // the editing view to keep the editing process uninterrupted.
      menuItem.click(() => {
        const commandName = isParagraph ? "paragraph" : "heading";
        const commandValue = isParagraph ? undefined : { value: option.model };

        editor.execute(commandName, commandValue);
        editor.editing.view.focus();
      });

      dropdownMenu.append(menuItem);

      const command = isParagraph ? paragraphCommand : headingCommand;

      // Make sure the dropdown and its items reflect the state of the
      // currently active command.
      const onValueChange = isParagraph
        ? onValueChangeParagraph
        : onValueChangeHeading;
      command.on("change:value", onValueChange);
      onValueChange();

      // Heading commands can become disabled, e.g. when the editor is read-only.
      // Make sure the UI reflects this state change.
      command.on("change:isEnabled", onIsEnabledChange);

      onIsEnabledChange();

      function onValueChangeHeading() {
        const isActive = !isParagraph && command.value === option.model;

        if (isActive) {
          dropdownToggle.children(":first").text(option.title);
        }

        menuItem.toggleClass("active", isActive);
      }

      function onValueChangeParagraph() {
        if (command.value) {
          dropdownToggle.children(":first").text(option.title);
        }

        menuItem.toggleClass("active", command.value);
      }

      function onIsEnabledChange() {
        dropdownToggle.attr("disabled", () => !command.isEnabled);
      }
    });
  }
}

// Extending the Editor class, which brings the base editor API.
export default class BootstrapEditor extends Editor {
  constructor(element, config) {
    super(config);

    // Remember the element the editor is created with.
    this.sourceElement = element;

    // Use the HTML data processor in this editor.
    this.data.processor = new HtmlDataProcessor();

    // Create the ("main") root element of the model tree.
    this.model.document.createRoot();

    // The UI layer of the editor.
    this.ui = new BootstrapEditorUI(this);

    // When editor#element is a textarea inside a form element,
    // the content of this textarea will be updated on form submit.
    attachToForm(this);
  }

  destroy() {
    // When destroyed, the editor sets the output of editor#getData() into editor#element...
    this.updateSourceElement();

    // ...and destroys the UI.
    this.ui.destroy();

    return super.destroy();
  }

  static create(element, config) {
    return new Promise(resolve => {
      const editor = new this(element, config);

      resolve(
        editor
          .initPlugins()
          // Initialize the UI first. See the BootstrapEditorUI class to learn more.
          .then(() => editor.ui.init(element))
          // Fill the editable with the initial data.
          .then(() => editor.data.init(getDataFromElement(element)))
          // Fire the `editor#ready` event that announce the editor is complete and ready to use.
          .then(() => editor.fire("ready"))
          .then(() => editor)
      );
    });
  }
}

// Mixing interfaces, which extends the basic editor API.
mix(BootstrapEditor, DataApiMixin);
mix(BootstrapEditor, ElementApiMixin);
</script>

<style scoped>
/* Give the editor some space and limits using a border. */
.ck-editor {
  margin: 1em 0;
  border: 1px solid hsla(0, 0%, 0%, 0.1);
  border-radius: 4px;
}

/* Adding internal spacing, border and background to the toolbar.  */
.ck-editor .btn-toolbar {
  padding: 0.5rem;
  background: hsl(240, 14%, 97%);
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
}

/* Tweaking the editable area for better readability. */
.ck-editor .ck-editor__editable {
  padding: 2em 2em 1em;
  overflow: auto;
}

/* When in read–only mode, the editable should fade out. */
.ck-editor .ck-editor__editable.ck-read-only {
  background: hsl(0, 0%, 98%);
  color: hsl(0, 0%, 47%);
}

/* Make sure the headings dropdown button does not change its size
as different headings are selected. */
.ck-editor .dropdown-toggle span {
  display: inline-block;
  width: 100px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
}

/* Make the headings dropdown items visually distinctive. */
.ck-editor .heading-item_heading1 {
  font-size: 1.5em;
}
.ck-editor .heading-item_heading2 {
  font-size: 1.3em;
}
.ck-editor .heading-item_heading3 {
  font-size: 1.1em;
}

.ck-editor [class*="heading-item_"] {
  line-height: 22px;
  padding: 10px;
}

.ck-editor [class*="heading-item_heading"] {
  font-weight: bold;
}

/* Give the basic styles buttons the icon–like look and feel. */
.ck-editor #bold {
  font-weight: bold;
}
.ck-editor #italic {
  font-style: italic;
}
.ck-editor #underline {
  text-decoration: underline;
}
</style>