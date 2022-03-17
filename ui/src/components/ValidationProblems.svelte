<script lang="ts">
  export let problems: Array<string> = [];
</script>

<div class="p-4 max-w-md rounded-lg bg-white">
  <p>
    Sorry, the ID you entered is invalid:
  </p>
  {#each problems as problem}
    <p>
      {problem}
    </p>
  {/each}
  <p>
    <!-- TODO: add link to doc -->
    You can read more here.
  </p>
</div>

