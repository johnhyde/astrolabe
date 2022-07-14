<script lang="ts">
  export let options: [string, any][];
  export let value: any;
  export let borderClass = "border-gold";
  export let onClass = "bg-navy";
  export let offClass = "bg-white";
</script>

<div class="flex mx-auto border {borderClass} rounded divide-x divide-gold bg-navy">
  {#each options as option}
    <div class="px-1.5 cursor-pointer" class:text-gray-400={value !== option[1]} on:click={() => value = option[1]}>
      {option[0]}
    </div>
  {/each}
</div>

