import {
  EditorState
} from "prosemirror-state";
import {
  keymap
} from "prosemirror-keymap";
import {
  undo,
  redo,
  history
} from "prosemirror-history";
import {
  baseKeymap,
  setBlockType
} from "prosemirror-commands";
import {
  DOMParser as PMDOMParser
} from "prosemirror-model";


export class Document {
  constructor(xml, xsltDom, schema) {
    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDom);
    const html = xsltProcessor.transformToFragment(xml, document);
    const dParser = PMDOMParser.fromSchema(schema);
    this.commands = {
      title: setBlockType(schema.nodes.title, {
        level: 1
      }),
      para: setBlockType(schema.nodes.para, {})
    };

    this.state = EditorState.create({
      schema: schema,
      doc: dParser.parse(html),
      plugins: [
        history(),
        keymap({
          "Mod-z": undo,
          "Mod-y": redo
        }),
        keymap(baseKeymap)
      ]
    });
  }
}