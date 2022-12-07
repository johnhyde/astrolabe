<script lang="ts">
  import { getPal, tagPal, untagPal } from 'lib/pals';
  import store from 'stores/store';

  export let patp: string;

  $: pal = getPal($store.pals, patp);

  let newTagText = '';
  $: newTags = newTagText.split(',').map(t => t.trim());
  $: sanitizedNewTags = newTags.map(t => t.toLocaleLowerCase().replaceAll(/[^-_.~a-z0-9]+/g, '_'));
  $: newTagsAreValid = newTags.every(tagIsValid);
  $: validationClasses = newTagsAreValid ? '' : 'border-red-500 bg-red-100'

  function tagIsValid(tag: string): boolean {
    return /^[-_.~a-z0-9]*$/.test(tag);
  }

  async function onTagSubmit({ key }) {
    if (newTagText && key == 'Enter') {
      await tagPal(patp, sanitizedNewTags);
      newTagText = '';
    }
  }
</script>

<div class="flex flex-wrap gap-1 text-sm justify-center">
  {#each pal.tags as tag}
    <div class="flex bg-gray-200 rounded divide-gray-500 divide-x items-center">
      <span class="px-1">
        {tag}
      </span>
      <button class="px-1 text-gray-500" on:click={() => untagPal(patp, tag)}>
        X
      </button>
    </div>
  {/each}
</div>
<input type="text" class="px-1 text-sm border border-gray-400 rounded {validationClasses}"
  on:keydown={onTagSubmit} bind:value={newTagText} placeholder="add_tags, like_this" />
