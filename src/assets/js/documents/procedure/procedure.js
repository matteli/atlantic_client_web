import {
  EditorState
} from "prosemirror-state";
import {
  Schema,
  DOMParser as PMDOMParser
} from "prosemirror-model";
import {
  keymap
} from "prosemirror-keymap";
import {
  baseKeymap,
  setBlockType
} from "prosemirror-commands";
import {
  undo,
  redo,
  history
} from "prosemirror-history";
import {
  insertPoint
} from "prosemirror-transform";


import {
  procedureXslt
} from "@/assets/js/documents/procedure/procedure.xslt.js";

const schema = new Schema({
  nodes: {
    content: {
      content: "procedure",
      toDOM(node) {
        return ["div", {
          class: "content"
        }, 0];
      },
      parseDOM: [{
        tag: "div.content"
      }]
    },
    procedure: {
      content: "mainProcedure",
      toDOM(node) {
        return ["div", {
          class: "procedure"
        }, 0];
      },
      parseDOM: [{
        tag: "div.procedure"
      }]
    },
    mainProcedure: {
      content: "proceduralStep+",
      toDOM(node) {
        return ["div", {
          class: "mainProcedure"
        }, 0];
      },
      parseDOM: [{
        tag: "div.mainProcedure"
      }]
    },
    proceduralStep: {
      content: "(title para*) | para+",
      toDOM(node) {
        return ["div", {
          class: "proceduralStep"
        }, 0];
      },
      parseDOM: [{
        tag: "div.proceduralStep"
      }]
    },
    title: {
      content: "text*",
      attrs: {
        level: {
          default: 1
        }
      },
      parseDOM: [{
          tag: "h1",
          attrs: {
            level: 1
          }
        },
        {
          tag: "h2",
          attrs: {
            level: 2
          }
        },
        {
          tag: "h3",
          attrs: {
            level: 3
          }
        },
        {
          tag: "h4",
          attrs: {
            level: 4
          }
        },
        {
          tag: "h5",
          attrs: {
            level: 5
          }
        },
        {
          tag: "h6",
          attrs: {
            level: 6
          }
        }
      ],
      toDOM(node) {
        return ["h" + node.attrs.level, {
          class: "title"
        }, 0]
      }
    },
    para: {
      content: "text*",
      toDOM(node) {
        return ["p", {
          class: "para"
        }, 0];
      },
      parseDOM: [{
        tag: "p"
      }]
    },
    text: {
      inline: true
    }
  },
  topNode: "content"
});

function addProceduralStep() {
  return function (state, dispatch) {
    let {
      $from,
      $to
    } = state.selection;
    const proceduralStepNode = schema.nodes.proceduralStep;
    const paraNode = schema.nodes.para;
    let point = insertPoint($from.doc, $from.pos, proceduralStepNode);
    console.log(dispatch);
    if (!point) return false;
    if (dispatch) dispatch(state.tr.insert(point, proceduralStepNode.create(null, paraNode.create())));
    return true;
  }
}

export class Procedure {
  constructor(content) {
    const xsltProcessor = new XSLTProcessor();
    const xsltDom = new DOMParser().parseFromString(
      procedureXslt,
      "text/xml"
    );
    xsltProcessor.importStylesheet(xsltDom);
    const xml = new DOMParser().parseFromString(content, "text/xml");
    const html = xsltProcessor.transformToFragment(xml, document);
    const dParser = PMDOMParser.fromSchema(schema);
    this.commands = {
      "proceduralStep": addProceduralStep(),
      "title": setBlockType(schema.nodes.title, {
        level: 1
      }),
      "para": setBlockType(schema.nodes.para, {}),
    }

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