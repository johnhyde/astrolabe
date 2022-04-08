<script lang="ts">
  import tooltip from "../actions/tooltip";
  export let title: string = '';
  export let doc: string = '';

</script>
{#if title}
  <span
    class="inline-block py-0.5 px-2 rounded-md bg-gold"
    use:tooltip={title}
  >
    <slot></slot>
  </span>
{:else}
  <span
    class="inline-block py-0.5 px-2 rounded-md bg-gold"
  >
    <slot></slot>
  </span>
{/if}

