export default function (html, xmlInit) {
  const xml = new DOMParser().parseFromString(xmlInit, "text/xml");
  console.log(xml);
  const contentNode = xml.getElementsByTagName("content");
  while (contentNode[0].lastElementChild) {
    contentNode[0].removeChild(contentNode[0].lastElementChild);
  }
  const treeXml = document.createTreeWalker(xml);
  treeXml.firstChild();
  treeXml.firstChild();
  do {
    if (treeXml.currentNode.nodeName == "content") break;
  } while (treeXml.nextSibling());

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
  const s = new XMLSerializer();
  const xmlString = s.serializeToString(xml);
  return xmlString;
}