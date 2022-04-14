const docLinkRegex = /\/~\/scry\/docs\/usr\/astrolabe\/([-~._\w\d]+).html/;

function convertDocLinks(node, onPathChange) {
  console.log(node);
  const links = node.querySelectorAll('a');
  for (let link of links) {
    let match = link.href.match(docLinkRegex);
    if (match) {
      let path = match[1];
      link.href="javascript:void(0)";
      link.addEventListener('click', () => onPathChange(path));
      // const button = document.createElement('button');
      // while(link.firstChild) {
      //   button.appendChild(link.firstChild);
      // }
      // link.parentNode.replaceChild(button, link);
      // debugger;
    }
  }
}

export default function docLinks(node, onPathChange: Function) {
  convertDocLinks(node, onPathChange)
  return {
    update: (onPathChange) => convertDocLinks(node, onPathChange),
  };
};
