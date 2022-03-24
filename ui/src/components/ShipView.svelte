<script lang="ts">
  import type { Scry } from '@urbit/http-api';
  import UrbitApi from '@urbit/http-api';
  import { settings } from '@urbit/api';
  import { clan, sein, patp2dec } from 'urbit-ob';

  import { link } from 'svelte-spa-router'
  import { normalizeId } from '../lib/id';
  import { linkToShip } from '../lib/link';
  import Sigil from "./Sigil.svelte";
  export let patp: string;
  let parentChain: any[];
  let rawPointInfoPromise: any;
  let rawPointInfo: any = {};
  let pointInfo: any = {};
  const api: UrbitApi = new UrbitApi('');

  $: shipClass = clan(patp);
  $: azPoint = ['galaxy', 'star', 'planet'].includes(shipClass);
  $: {
    let parents = [patp];
    let galaxyFound = false;
    let count = 10;
    while (!galaxyFound && count > 0) {
      count--;
      if (count == 0) {
        throw new Error("You've got an infinite loop in building the parent chain");
      }
      let firstItem = parents[0];
      if (clan(firstItem) == 'galaxy') {
        galaxyFound = true;
      } else {
        parents.unshift(sein(firstItem))
      }
    }
    parents.pop();
    parentChain = parents.map(parent => {
      return { patp: parent, link: linkToShip(parent) };
    });
  }
  $: {
    rawPointInfo = {};
    if (azPoint) {
      rawPointInfoPromise = api.scry<any>({ app: 'astrolabe', path: `/point/${patp}` });
      rawPointInfoPromise.then((info) => {
        rawPointInfo = info;
      });
    }
  }
  $: {
    pointInfo = {};
    let status, life, rift;
    if (!azPoint) {
    } else if (rawPointInfo.point) {
      const { point } = rawPointInfo;
      status = point.dominion.toUpperCase();
      if (status.length == 2) {
        status = `Activated on ${status}?`;
      } else {
        status = 'Spawned?'
      }
      life = point.net.keys.life;
      rift = point.net.rift;
      const { sponsor } = point.net;
      if (sponsor.has) {
        pointInfo.sponsor = normalizeId(sponsor.who);
      }
    } else {
      status = 'Unspawned';
      life = 0;
      rift = 0;
    }
    pointInfo = {
      ...pointInfo,
      status,
      life,
      rift,
    };
  }
</script>

<div class="flex justify-center">
  <div class="p-8 max-w-md w-full rounded-lg bg-white">
    <div class="mx-auto">
      <Sigil patp={patp} size={256} />
    </div>
    <h2 class="text-2xl text-center">{patp}</h2>
    <p>
      Ship Type: {shipClass}
    </p>
    {#if azPoint}
      <p class="break-all">
        Azimuth #: {patp2dec(patp)}
      </p>
    {/if}
    {#if parentChain.length > 0}
      <p>
        Parent:
        {#each parentChain as parent, index}
        {#if index > 0}{' > '} {/if}
          <a use:link={parent.link}>{parent.patp}</a>
        {/each}
      </p>
    {/if}
    {#if shipClass !== 'galaxy'}
      <p>
        {#if pointInfo.sponsor && shipClass !== 'galaxy'}
          Sponsor:
          <a use:link={linkToShip(pointInfo.sponsor)}>{pointInfo.sponsor}</a>
        {:else}
          Unsponsored
        {/if}
      </p>
    {/if}
    {#if pointInfo.status}
      <p>
        Status:
        {pointInfo.status}
      </p>
      <p>
        Life:
        {pointInfo.life}
      </p>
      <p>
        Rift:
        {pointInfo.rift}
      </p>
    {/if}
    {#await rawPointInfoPromise}
      Loading Azimuth info...
    {:then value}
      {#if value.point}
        <p>
          Raw Info:
          {@html JSON.stringify(rawPointInfo, null, 2)}
        </p>
      {/if}
    {/await}
  </div>
</div>
