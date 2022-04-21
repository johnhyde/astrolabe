<script lang="ts">
  import TooltipAndDocLink from "./TooltipAndDocLink.svelte";
  export let title: string = '';
  export let doc: string = '';

</script>

<TooltipAndDocLink text={title} {doc} class="inline-block py-0.5 px-2 rounded-md bg-gold">
  <slot></slot>
</TooltipAndDocLink>
