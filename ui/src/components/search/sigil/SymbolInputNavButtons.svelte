<script lang="ts">
  import upArrow from 'assets/up-arrow.svg';
  import xIcon from 'assets/x.svg';

  export let onDone: () => void = null;
  export let onClear: () => void = null;

  let buttonClasses = 'cursor-pointer border border-gray-500 rounded-md aspect-square w-[48px]';
</script>

<style lang="scss">
  .grid-cols-custom {
    grid-template-columns: repeat(auto-fill, 48px);
  }
</style>

<div class="grid gap-1 self-start justify-center mr-1 xs:mr-0 xs:mb-1 xs:self-stretch {(onDone && onClear) ? 'grid-cols-custom' : ''}">
    {#if onDone}
      <img src={upArrow} alt="done" class={buttonClasses} on:click={onDone}/>
    {/if}
    {#if onClear}
      <img src={xIcon} alt="clear" class={buttonClasses} on:click={onClear}/>
    {/if}
  </div>

