identAndStatusSection: {
    content: "dmAddress",
    toDOM(node) {
      return ["div", {
        class: "identAndStatusSection"
      }, 0];
    },
    parseDOM: [{
      tag: "div.identAndStatusSection"
    }]
  },

  dmAddress: {
    content: "dmIdent",
    toDOM(node) {
      return ["div", {
        class: "dmAddress",
      }, 0];
    },
    parseDOM: [{
      tag: "div.dmAddress"
    }]
  },

  dmIdent: {
    content: "dmCode",
    toDOM(node) {
      return ["div", {
        class: "dmIdent"
      }, 0];
    },
    parseDOM: [{
      tag: "div.dmIdent"
    }]
  },

  dmCode: {
    toDOM(node) {
      return ["div", {
        class: "dmCode",
        "data-modelIdentCode": "",
        "data-systemDiffCode": "",
        "data-systemCode": "",
        "data-subSystemCode": "",
        "data-assyCode": "",
        "data-disassyCode": "",
        "data-disassyCodeVariant": "",
        "data-infoCode": "",
        "data-infoCodeVariant": "",
        "data-itemLocationCode": "",
      }];
    },
    parseDOM: [{
      tag: "div.dmCode"
    }]
  },