<script lang="ts">
  
  import UrbitApi from '@urbit/http-api';
  import { clan, sein, patp2dec } from 'urbit-ob';
  
  import { cite, normalizeId } from '../lib/id';
  import tooltip from "../actions/tooltip";
  import Sigil from "./Sigil.svelte";
  import GoldBadge from './GoldBadge.svelte';
  import TooltipAndDocLink from "./TooltipAndDocLink.svelte";
  import ShipLink from './ShipLink.svelte';
  import EthAddressLink from './EthAddressLink.svelte';
  import CollapsibleContent from './CollapsibleContent.svelte';

  export let patp: string;

  let parentChain: any[];
  let rawPointInfoPromise: any;
  let rawPointInfo: any = {};
  let pointInfo: any = {};
  const api: UrbitApi = new UrbitApi('');
  const spawnStatusOptions = {
    unspawned: {
      text: 'unspawned',
      tooltip: 'This point has not yet been spawned by its parent',
    },
    locked: {
      text: 'locked',
      tooltip: 'This point is currently locked in a Linear Release Contract',
    },
    spawned: {
      text: 'spawned',
      tooltip: `This point has been spawned`,
    },
    spawnedNoKeys: {
      text: 'spawned (no keys set)',
      tooltip: 'This point has been spawned, but no keys have been set',
    },
  }
  const layerOptions = {
    l1: {
      text: 'on layer 1',
      tooltip: 'This point is secured as an NFT on the Ethereum blockchain',
    },
    l2: {
      text: 'on layer 2',
      tooltip: `This point is secured by Urbit's "Layer 2" solution`,
    },
    spawn: {
      text: 'spawns on layer 2',
      tooltip: 'This point lives on layer 1, but it spawns new points on layer 2',
    },
  }

  $: shipClass = clan(patp);
  $: azPoint = ['galaxy', 'star', 'planet'].includes(shipClass);
  $: canSpawnPoints = ['galaxy', 'star'].includes(shipClass);
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
    parentChain = parents;
  }
  $: {
    rawPointInfo = {};
    if (azPoint) {
      rawPointInfoPromise = api.scry<any>({ app: 'astrolabe', path: `/point/${patp}` });
      rawPointInfoPromise.then((info) => {
        rawPointInfo = info;
      }).catch((error) => {
        rawPointInfo.error = error;
      });
    }
  }
  $: {
    pointInfo = {};
    let spawnStatus: any, layer: any, life: number, rift: number;
    let keysSet = false;
    if (!azPoint) {

    } else if (rawPointInfo.point) {
      const { point } = rawPointInfo;
      life = point.net.keys.life;
      rift = point.net.rift;
      if (life > 0) {
        keysSet = true;
      }

      pointInfo.proxies = point.own;
      const { dominion } = point;
      layer = layerOptions[dominion];

      if (pointInfo.proxies.owner.address === '0x86cd9cd0992f04231751e3761de45cecea5d1801') {
        spawnStatus = spawnStatusOptions.locked; 
      } else if (keysSet) {
        spawnStatus = spawnStatusOptions.spawned;
      } else {
        spawnStatus = spawnStatusOptions.spawnedNoKeys;
      }
      const { sponsor } = point.net;
      if (sponsor.has) {
        pointInfo.sponsor = normalizeId(sponsor.who);
      }
    } else if (rawPointInfo.error) {
      // no info found
      spawnStatus = spawnStatusOptions.unspawned;
      life = 0;
      rift = 0;
    } else {
      // request pending
    }
    pointInfo = {
      ...pointInfo,
      layer,
      spawnStatus,
      keysSet,
      life,
      rift,
    };
  }
</script>

<div class="p-8 max-w-md w-full rounded-lg bg-white flex flex-col md:max-w-2xl">
  <div class="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-8 md:space-y-0">
    <div class="w-full max-w-[256px] md:min-w-[256px] flex-shrink-0">
      <Sigil patp={patp} size={256} />
    </div>
    <div class="grow w-full min-w-0">
      <h2 class="text-2xl text-center">
        <TooltipAndDocLink
          text="The ship's @p (click to learn more)"
          doc="patpee" class="inline"
        >
          {cite(patp)}
        </TooltipAndDocLink>
      </h2>
      {#if (!azPoint)}
        <h3 class="text-lg text-center text-gray-700">{patp}</h3>
      {/if}
      <h4 class="text-center text-gray-700 break-words">
        <!-- <TooltipAndDocLink
          text="The integer representation of this ID"
          doc="patpee" class="inline"
        > -->
          {patp2dec(patp)}
        <!-- </TooltipAndDocLink> -->
      </h4>
      <div class="flex flex-wrap justify-center gap-1.5 my-1.5">
        <GoldBadge title={"it's a " + shipClass} doc={shipClass}>{shipClass}</GoldBadge>
        {#if azPoint}
          {#if pointInfo.spawnStatus}
            <GoldBadge title={pointInfo.spawnStatus.tooltip}>
              {pointInfo.spawnStatus.text}
            </GoldBadge>
          {/if}
          {#if pointInfo.layer}
            <GoldBadge title={pointInfo.layer.tooltip} doc="l2">{pointInfo.layer.text}</GoldBadge>
          {/if}
        {:else if (shipClass === 'moon')}
          <span>of</span>
          <ShipLink patp={parentChain.at(-1)}></ShipLink>
        {:else if (shipClass === 'comet')}
          <span>under</span>
          <ShipLink patp={parentChain.at(-1)}></ShipLink>
        {/if}
      </div>
      <div class="mt-4 w-full break-words">
        {#if parentChain.length > 0}
          <p>
            {parentChain.length === 1 ? 'Parent:' : 'Parent Chain:'}
            {#each parentChain as parent, index}
            {#if index > 0}{' > '}{/if}
              <ShipLink patp={parent}></ShipLink>
            {/each}
          </p>
        {/if}
        {#if azPoint}
          <CollapsibleContent>
            <b slot="title">Azimuth Details</b>
            <div slot="content">
              {#await rawPointInfoPromise}
                Loading Azimuth info...
              {:then}
                {#if shipClass !== 'galaxy'}
                  <p>
                    {#if pointInfo.sponsor && shipClass !== 'galaxy'}
                      Sponsor:
                      <ShipLink patp={pointInfo.sponsor}></ShipLink>
                    {:else}
                      Unsponsored
                    {/if}
                  </p>
                {/if}
                <p>
                  <TooltipAndDocLink
                    text="Number of times this ship's keys have been set. Must be at least 1 to use the network."
                    doc="keys"
                    class="inline"
                  >
                    Key Revision:
                    {pointInfo.life}
                  </TooltipAndDocLink>
                </p>
                <p>
                  <TooltipAndDocLink
                    text="Number of times this ship has breached."
                    doc="keys"
                    class="inline"
                  >
                    Factory Resets:
                    {pointInfo.rift}
                  </TooltipAndDocLink>
                </p>
                {#if pointInfo.proxies}
                  <p>
                    <span>
                      Owner:
                      <EthAddressLink address={pointInfo.proxies.owner.address} />
                    </span>
                  </p>
                  <p>
                    <span>
                      Management Proxy:
                      <EthAddressLink address={pointInfo.proxies['management-proxy'].address}>
                        <span class="text-gray-700">not set</span>
                      </EthAddressLink>
                    </span>
                  </p>
                  <p>
                    <span>
                      Spawn Proxy:
                      <EthAddressLink address={pointInfo.proxies['spawn-proxy'].address}>
                        <span class="text-gray-700">not set</span>
                      </EthAddressLink>
                    </span>
                  </p>
                  <p>
                    <span>
                      Transfer Proxy:
                      <EthAddressLink address={pointInfo.proxies['transfer-proxy'].address}>
                        <span class="text-gray-700">not set</span>
                      </EthAddressLink>
                    </span>
                  </p>
                  {#if shipClass === 'galaxy'}
                    <p>
                      <span>
                        Voting Proxy:
                        <EthAddressLink address={pointInfo.proxies['voting-proxy'].address}>
                          [not set]
                        </EthAddressLink>
                      </span>
                    </p>
                  {/if}
                {/if}
                
                <!-- {#if value && value.point}
                  <pre class="text-sm overflow-scroll">
                    Raw Info:{JSON.stringify(rawPointInfo, null, 2)}
                  </pre>
                {/if} -->
              {/await}
            </div>
          </CollapsibleContent>
        {/if}
      </div>
    </div>
  </div>
  {#if canSpawnPoints}
    <div>
      <h3 class="text-lg">Spawned Points</h3>
      <span class="text-green-600">// TODO</span>
    </div>
  {/if}
</div>
