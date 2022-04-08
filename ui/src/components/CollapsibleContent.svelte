<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

  export let open: boolean = true;
</script>

<div class="mt-2">
  <button on:click={() => (open = !open)}>
    <span class="font-mono">{open ? '▼' : '▶'}</span>
    &nbsp;
    <slot name="title"></slot>
  </button>
  {#if open}
    <div class="ml-[22px]" transition:slide="{{duration: 50 }}">
      <slot name="content"></slot>
    </div>
  {/if}
</div>