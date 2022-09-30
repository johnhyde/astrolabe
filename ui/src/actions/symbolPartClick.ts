function listenOnSvgElements(node, onPathChange) {
  const parts = node.querySelectorAll('path, circle, line');
  for (let part of parts) {
    if (part.getAttribute('dataisgeon') === 'true') continue;
    if (onPathChange) {
      part.onclick = () => {
        onPathChange(part.getAttribute('part-key'));
      };
    } else {
      part.onclick = null;
    }
  }
}

export default function svgClick(node: HTMLElement, { onPartClick, enabled = true, svgString }) {
  if (enabled) listenOnSvgElements(node, onPartClick);

  return {
    update: ({ onPartClick, enabled = true, svgString }) => {
      if (enabled) {
        listenOnSvgElements(node, onPartClick);
      } else {
        listenOnSvgElements(node, undefined);
      }
    },
  };
}
