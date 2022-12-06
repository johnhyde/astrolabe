<script lang="ts">
  export let name: string;
  export let open = true;
  export let halfWidth = false;
  $: containerClasses = open ? ('w-full ' + (halfWidth ? 'md:w-1/2' : '')) : 'w-min justify-self-start';
  $: boxClasses = open ? 'border-gray-500' : 'border-gray-400 bg-gray-400';
  $: buttonClasses = open ? 'text-gray-600' : 'text-white';
</script>

<div class="p-1 {containerClasses}">
  <div class="border rounded-md {boxClasses}" on:click={() => { if (!open) open = true; }}>
    <div class="flex flex-wrap">
      <button class="px-2 text-sm {buttonClasses}" on:click|stopPropagation={() => open = !open}>
        {name}
      </button>
      {#if open}
        <slot name="top-bar"/>
      {/if}
    </div>
    {#if open}
      <slot/>
    {/if}
  </div>
</div>
  