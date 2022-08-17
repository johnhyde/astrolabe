const docLinkRegex = /\/~\/scry\/docs\/usr\/astrolabe\/([-~._\w\d]+).html/;

function listenOnSvgElements(node, onPathChange) {
  const parts = node.querySelectorAll('path, circle, line');
  for (let part of parts) {
    if (part.getAttribute('dataisgeon') === 'true') continue;
    part.addEventListener('click', () => {
      onPathChange(part.getAttribute('part-key'));
    });
  }
}

// function docLinks(node, onPathChange: Function) {
//   convertDocLinks(node, onPathChange)
//   return {
//     update: (onPathChange) => convertDocLinks(node, onPathChange),
//   };
// };

export default function svgClick(node: HTMLElement, { onPartClick, enabled = true, svgString }) {
  if (enabled) listenOnSvgElements(node, onPartClick);

  return {
    update: ({ onPartClick, enabled = true, svgString }) => {
      if (enabled) listenOnSvgElements(node, onPartClick);
    },
  };
}