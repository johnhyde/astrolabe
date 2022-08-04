import tippy from 'tippy.js';
// import DocLink from '@/docs/DocLink.svelte'; // TODO try to add a link in the tooltip somehow or something, like:
// const app = new DocLink({
//   target: document.getElementBySelector('.tippy')
// })

const defaultParams = {
  theme: 'astrolabe',
  delay: [500, 0],
};

function getParams(paramsOrContent:any = {}, overrides = {}) {
  let params = paramsOrContent;
  if (typeof paramsOrContent === 'string') {
    params = { content: paramsOrContent };
  }
  return {
    ...defaultParams,
    ...params,
    ...overrides,
  };
}

export default function tooltip(node, paramsOrContent: any = {}) {
  const onTrigger = () => {
    console.log('triggered');
    node.dispatchEvent(new CustomEvent("tooltipTriggered"));
	};
  const onUntrigger = () => {
    console.log('untriggered');
    node.dispatchEvent(new CustomEvent("tooltipUntriggered"));
	};
  const onClickOutside = (_, e) => {
    e.stopPropagation();
  };
  const listeners = {
    onTrigger,
    onUntrigger,
    onClickOutside,
  }

  const params = getParams(paramsOrContent, listeners);
  const { content } = params;

  // Let's make sure the "aria-label" attribute
  // is set so our element is accessible:
  // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute
  if (!node.getAttribute("aria-label")) node.setAttribute("aria-label", content);


  // Support any of the Tippy props by forwarding all "params":
  // https://atomiks.github.io/tippyjs/v6/all-props/
  const tip: any = tippy(node, params);
  const hideTip = (e) => {
    if (tip.state.isShown) {
      tip.hide();
      // e.stopPropagation();
    }
  }
  node.addEventListener('click', hideTip);


  return {
    // If the props change, let's update the Tippy instance:
    update: (newParams) => tip.setProps(getParams(newParams)),

    // Clean up the Tippy instance on unmount:
    destroy: () => {
      node.removeEventListener('click', hideTip);
      tip.destroy();
    }
  };
};
