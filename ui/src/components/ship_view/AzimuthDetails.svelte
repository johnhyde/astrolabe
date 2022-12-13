<script lang="ts">
  import { clan, patp2dec } from 'urbit-ob';
  import { getPoint, getSpawnedPoints } from 'lib/api';
  import { generateParentChain, processPointInfo } from 'lib/ship';
  import TooltipAndDocLink from '@/common/TooltipAndDocLink.svelte';
  import EthAddressLink from '@/common/EthAddressLink.svelte';
  import ShipChain from './ShipChain.svelte';

  export let patp: string;
  export let pointInfo: any = {};


  $: shipClass = clan(patp);
  $: azPoint = ['galaxy', 'star', 'planet'].includes(shipClass);
</script>

{#if azPoint}
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
{/if}
