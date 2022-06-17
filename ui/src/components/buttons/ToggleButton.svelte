<script lang="ts">
  export let on: boolean = true;
</script>

<button on:click
  class="w-4 h-4 rounded-full border border-navy"
  class:bg-white={!on}
  class:bg-navy={on}
/>

