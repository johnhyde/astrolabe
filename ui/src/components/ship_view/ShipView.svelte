<script lang="ts">
  import { clan, patp2dec } from 'urbit-ob';
  
  import { cite, normalizeId } from 'lib/id';
  import { getPoint, getSpawnedPoints } from 'lib/api';
  import { generateParentChain, processPointInfo } from 'lib/ship';
  import Sigil from '@/common/Sigil.svelte';
  import GoldBadge from '@/common/GoldBadge.svelte';
  import TooltipAndDocLink from '@/common/TooltipAndDocLink.svelte';
  import ShipLink from '@/common/ShipLink.svelte';
  import ChartLink from '@/common/ChartLink.svelte';
  import EthAddressLink from '@/common/EthAddressLink.svelte';
  import LoadingSpinner from '@/common/LoadingSpinner.svelte';
  import CollapsibleContent from '@/CollapsibleContent.svelte';
  import ShipChain from './ShipChain.svelte';
  import AzimuthDetails from './AzimuthDetails.svelte';
  import ShipChildrenTabs from './ShipChildrenTabs.svelte';
  import ProfileShipViewExtension from '~/components/extensions/ProfileShipViewExtension.svelte';
  import PalsShipViewExtension from '@/pals/PalsShipViewExtension.svelte';
  import AppsShipViewExtension from '@/extensions/AppsShipViewExtension.svelte';
  // import GroupsShipViewExtension from '~/components/extensions/GroupsShipViewExtension.svelte';

  export let patp: string;

  let parentChain: any[];
  let rawPointInfoPromise: any;
  let rawPointInfo: any = null;
  let pointInfo: any = {};

  $: shipClass = clan(patp);
  $: azPoint = ['galaxy', 'star', 'planet'].includes(shipClass);
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
                <AzimuthDetails {patp} {pointInfo}></AzimuthDetails>

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
    <ProfileShipViewExtension {patp} />
    <PalsShipViewExtension {patp} />
    <AppsShipViewExtension {patp} />
    <!-- <GroupsShipViewExtension {patp} /> -->
  </div>
  {#if azPoint}
    <div class="mt-5 border-t">
      <ShipChildrenTabs {patp} />
    </div>
  {/if}
</div>
