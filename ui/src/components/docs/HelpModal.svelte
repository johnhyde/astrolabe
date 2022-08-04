<script lang="ts">
  import docs from 'stores/docs';
  import Doc from './Doc.svelte';

  function close() {
    docs.hide()
  }

  function navigate({ detail: path }) {
    docs.show(path);
  }
</script>

{#if $docs.show}
  <div class="absolute w-full h-full bg-navy opacity-50 cursor-pointer z-50" on:click/>
  <div class="absolute w-full h-full z-50 overflow-y-auto" on:click={close}>
    <div class="mx-4 2xs:mx-8 md:max-w-xl md:mx-auto">
      <div class="py-4 2xs:py-8">
        <div on:click|stopPropagation>
          <Doc path={$docs.path} on:close={close} on:navigate={navigate} />
        </div>
      </div>
    </div>
  </div>
{/if}
