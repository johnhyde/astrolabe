<script lang="ts">
  import { slide } from 'svelte/transition';
  export let open: boolean = true;
</script>

<div class="mt-2">
  <button on:click={() => (open = !open)}>
    <span class="font-mono inline-block transition duration-150 {open ? 'rotate-90' : ''}">▶</span>
    &nbsp;
    <slot name="title"></slot>
  </button>
  {#if open}
    <!-- turns out it's important not to put an await in the content -->
    <div class="ml-[22px]" transition:slide|local="{{duration: 150 }}">
      <slot name="content"></slot>
    </div>
  {/if}
</div>