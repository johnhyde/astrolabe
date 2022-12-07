<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown';
  import { uxToHex } from 'lib/utils';
  import { normalizeId } from 'lib/id';
  import store from 'stores/store';
  import Sigil from "@/common/Sigil.svelte";
  import ExtensionWindow from '@/ExtensionWindow.svelte';

  export let patp: string;
  $: contact = $store.contacts[normalizeId(patp)];
  $: color = contact && uxToHex(contact.color);
  $: somethingToShow = contact && (contact.nickname || contact.cover || contact.avatar || contact.bio);
</script>

{#if somethingToShow}
  <ExtensionWindow name="Groups">
    <svelte:fragment slot="top-bar">
      {#if contact.nickname}
        <div class="grow m-1 flex justify-center align-center">
          {contact.nickname}
        </div>
      {/if}
    </svelte:fragment>
    <div class="flex flex-wrap py-2">
      {#if contact.cover}  
        <img src={contact.cover} alt="profile cover image"
        class="m-1 -mb-16 w-full h-48 border border-black rounded-lg object-cover min-w-0"
        />
      {/if}
      <div class="flex flex-wrap md:flex-nowrap justify-center">
        <div class="mx-8 max-w-[128px] min-w-[128px] h-fit grow overflow-hidden rounded-lg">
          {#if contact.avatar}
          <img src={contact.avatar} alt="custom avatar"
          class="aspect-square object-cover max-w-[128px] min-w-0"
          />
          {:else}
          <Sigil patp={patp} size={128} bgColor={color} useNew />
          {/if}
        </div>
        {#if contact.bio}
          <div class="text-sm p-3 bg-white rounded-tl-lg rounded-br-lg whitespace-pre-line">
            <SvelteMarkdown source={contact.bio} />
          </div>
        {/if}
      </div>
      <!-- <p class="whitespace-pre-line">
        {contact.bio}
      </p> -->
    </div>
  </ExtensionWindow>
{/if}

