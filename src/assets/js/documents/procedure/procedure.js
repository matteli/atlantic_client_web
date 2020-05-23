import {
  Schema
} from "prosemirror-model";

export const procedureSchema = new Schema({
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