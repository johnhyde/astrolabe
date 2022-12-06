<script lang="ts">
  
  
  
  import { clan, patp2dec } from 'urbit-ob';
  
  import { cite, normalizeId } from 'lib/id';
  import { getPoint, getSpawnedPoints } from 'lib/api';
  import { generateParentChain, processPointInfo } from 'lib/ship';
  import Sigil from "./Sigil.svelte";
  import GoldBadge from './GoldBadge.svelte';
  import TooltipAndDocLink from "./TooltipAndDocLink.svelte";
  import ShipLink from './ShipLink.svelte';
  import ChartLink from './ChartLink.svelte';
  import EthAddressLink from './EthAddressLink.svelte';
  import CollapsibleContent from './CollapsibleContent.svelte';
  import ShipChain from './ShipChain.svelte';
  import ShipListings from './ShipListings.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';;
  import GroupsShipViewExtension from './groups/GroupsShipViewExtension.svelte';
  import PalsShipViewExtension from './pals/PalsShipViewExtension.svelte';

  export let patp: string;

  let parentChain: any[];
  let rawPointInfoPromise: any;
  let rawPointInfo: any = null;
  let pointInfo: any = {};
  let rawSpawnedPointsPromise: any;
  let rawSpawnedPoints: any = null;
  let spawnedPoints: string[] = [];

  $: shipClass = clan(patp);
  $: azPoint = ['galaxy', 'star', 'planet'].includes(shipClass);
  $: canSpawnPoints = ['galaxy', 'star'].includes(shipClass);
  $: spawnableClassPlural = !canSpawnPoints ? '' : (shipClass === 'galaxy' ? 'Stars' : 'Planets');
  $: {
    parentChain = generateParentChain(patp);
  }
  $: {
    rawPointInfo = null;
    if (azPoint) {
      rawPointInfoPromise = getPoint(patp);
      rawPointInfoPromise.then((info) => {
        rawPointInfo = info;
      }).catch((error) => {
        rawPointInfo = { error };
      });
    }
  }
  $: {
    rawSpawnedPoints = null;
    if (canSpawnPoints) {
      rawSpawnedPointsPromise = getSpawnedPoints(patp);
      rawSpawnedPointsPromise.then((info) => {
        rawSpawnedPoints = info;
      }).catch((error) => {
        rawSpawnedPoints = { error };
      });
    }
  }
  $: {
    spawnedPoints = [];
    if (rawSpawnedPoints?.points) {
      spawnedPoints = rawSpawnedPoints?.points.map(patp => ({ patp: normalizeId(patp) }));
    }
  }
  $: {
    pointInfo = {};
    if (azPoint) {
      pointInfo = processPointInfo(rawPointInfo);
    }
  }
</script>

<div class="p-8 max-w-md w-full rounded-lg bg-white flex flex-col md:max-w-2xl">
  <div class="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-8 md:space-y-0">
    <div class="w-full max-w-[256px] md:min-w-[256px] flex-shrink-0">
      <Sigil patp={patp} size={256} useNew />
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
      <!-- {#if (nickname)}
        <h3 class="text-lg text-center text-gray-800">{nickname}</h3>
      {/if} -->
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
      {#if pointInfo?.spawnedUnlocked}
        <div class="w-full text-center my-3">
          <ChartLink {patp}>View in Star Chart ↗</ChartLink>
        </div>
      {/if}
      <div class="mt-4 w-full break-words">
        {#if parentChain.length > 0}
          <p>
            {parentChain.length === 1 ? 'Parent:' : 'Parent Chain:'}
            <ShipChain shipChain={parentChain}></ShipChain>
          </p>
        {/if}
        {#if azPoint}
          <CollapsibleContent>
            <b slot="title">Azimuth Details</b>
            <div slot="content">
              {#await rawPointInfoPromise}
                <LoadingSpinner spinnerClass="text-black" />
              {:then}
                {#if shipClass !== 'galaxy'}
                  <p>
                    {#if pointInfo.sponsorChain && pointInfo.sponsorChain.length > 0}
                      <p>
                        {pointInfo.sponsorChain.length === 1 ? 'Sponsor:' : 'Sponsor Chain:'}
                        <ShipChain shipChain={pointInfo.sponsorChain}></ShipChain>
                      </p>
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
  <div class="flex flex-wrap shrink min-h-0 h-fit -m-1 mt-2 justify-evenly justify-items-center">
    <GroupsShipViewExtension {patp} />
    <PalsShipViewExtension {patp} />
  </div>
  {#if canSpawnPoints}
    <div class="mt-5 p-3 border-t">
      {#await rawPointInfoPromise then}
        <h3 class="text-lg">
          {#if pointInfo.spawnedCount}
          {pointInfo.spawnedCount} Spawned {spawnableClassPlural}:
          {:else}
            No Spawned {spawnableClassPlural}
          {/if}
        </h3>
      {/await}
      {#await rawSpawnedPointsPromise}
        Loading {spawnableClassPlural}...
      {:then}
        <!-- TODO: pagination -->
        <ShipListings
          ships={spawnedPoints}
          linkToShips
        />
      {/await}
    </div>
  {/if}
</div>
