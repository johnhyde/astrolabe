<script lang="ts">
  export let on: boolean = true;
  export let borderClass = "border-navy";
  export let onClass = "bg-navy";
  export let offClass = "bg-white";
</script>

<button on:click
  class={`w-4 h-4 rounded-full border ${borderClass} ${on ? onClass : offClass}`}
/>

