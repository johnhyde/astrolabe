<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Symbol from './Symbol.svelte';

  export let components: string[] = [];
  export let focused: boolean = false;
  export let enabled: boolean = true;
  export let padding: number = undefined;
  
  const dispatch = createEventDispatcher();
  let size = 48;

  $: focusedClasses = focused ? 'border-2 border-gold-s1 p-[3px]' : 'border border-gray-500 p-[4px]';
  $: enabledClasses = enabled ? '' : 'opacity-50';
  $: includesGeon = components.find(c => c[0] === 'g') !== undefined;
  $: defaultPadding = includesGeon ? 0 : 0;
  $: actualPadding = padding !== undefined ? padding : defaultPadding;

  function onClick(e) {
    if (enabled) dispatch('click', e);
  }
</script>
<div
class="bg-white rounded-md w-[48px] {focusedClasses} {enabledClasses}"
on:click={onClick}
>
<div class:cursor-pointer={enabled}
  style:padding="{actualPadding}px"
>
  <Symbol {components} {size} inverted={!includesGeon} />
</div>
</div>

