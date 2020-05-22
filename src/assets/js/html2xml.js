export default function (html) {
  const xml = document.createDocumentFragment();
  const treeXml = document.createTreeWalker(xml);
  const xmlElmt = document.createElementNS("", "dmodule");
  treeXml.currentNode.appendChild(xmlElmt);
  treeXml.lastChild();
  walk(html.firstElementChild);
  function walk(node) {
    if (node.nodeType == 1) {
      const xmlElmt = document.createElementNS("", node.className);
      treeXml.currentNode.appendChild(xmlElmt);
      if (node.hasChildNodes()) {
        treeXml.lastChild();
        walk(node.firstChild);
      }
      if (node.nextSibling) {
        treeXml.parentNode();
        walk(node.nextSibling);
      }
    } else if (node.nodeType == 3) {
      const textElmt = document.createTextNode(node.nodeValue);
      treeXml.currentNode.appendChild(textElmt);
    }
    return
  }
  //console.log(xml);
  const s = new XMLSerializer();
  const xmlString = s.serializeToString(xml);
  const xmlStringF0 = '<?xml version="1.0" encoding="UTF-8"?>' + xmlString;

  function breakLine(match, offset, string) {
    return (match.substring(0, 1) + "\n" + match.substring(1, 2))
  }
  const xmlStringF1 = xmlStringF0.replace(/>/g, "$&\n");
  const xmlStringF2 = xmlStringF1.replace(/.</g, breakLine);
  return xmlStringF2;
}