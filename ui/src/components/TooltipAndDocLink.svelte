<script lang="ts">
  import Tooltip from "./Tooltip.svelte";
  import DocLink from './docs/DocLink.svelte'; // TODO try to add a link in the tooltip somehow or something, like:
  export let text: string = '';
  export let doc: string = '';
  let className: string = '';
  export { className as class };
</script>

<Tooltip text={text} enabled={text !== ''} let:tooltipActive={tooltipActive} class={className}>
  <DocLink modal path={doc} enabled={doc !== '' && tooltipActive}>
    <slot></slot>
  </DocLink>
</Tooltip>
