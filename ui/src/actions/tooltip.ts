import tippy from 'tippy.js';

const defaultParams = {
  theme: 'astrolabe',
};

function getParams(paramsOrContent:any = {}) {
  if (typeof paramsOrContent === 'string') {
    return {
      ...defaultParams,
      content: paramsOrContent,
    }
  }
  return {
    ...defaultParams,
    ...paramsOrContent,
  };
}

export default function tooltip(node, paramsOrContent: any = {}) {
  const params = getParams(paramsOrContent);
  const { content } = params;

  // Let's make sure the "aria-label" attribute
  // is set so our element is accessible:
  // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute
  if (!node.getAttribute("aria-label")) node.setAttribute("aria-label", content);


  // Support any of the Tippy props by forwarding all "params":
  // https://atomiks.github.io/tippyjs/v6/all-props/
  const tip: any = tippy(node, params);

  return {
    // If the props change, let's update the Tippy instance:
    update: (newParams) => tip.setProps(getParams(newParams)),

    // Clean up the Tippy instance on unmount:
    destroy: () => tip.destroy(),
  };
};
