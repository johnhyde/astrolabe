<script lang="ts">
  import tooltip from 'actions/tooltip';
  export let text: string = '';
  let className: string = '';
  export { className as class };
  export let enabled: boolean = true;
  let tooltipActive: boolean = false;

  let timer;

	const debounce = v => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			tooltipActive = v;
		}, 50);
	}

  function onTrigger() {
    debounce(true);
  }

  function onUntrigger() {
    debounce(false);
  }

</script>

{#if enabled}
  <div use:tooltip={text} on:tooltipTriggered={onTrigger} on:tooltipUntriggered={onUntrigger} class={className}>
    <slot {tooltipActive} />
  </div>
{:else}
  <div class={className}>
    <slot tooltipActive={false} />
  </div>
{/if}

