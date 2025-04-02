<script lang="ts">
    import { toasts } from '$lib/stores/toastStore';
    import { slide } from 'svelte/transition';
    import { Toast } from 'flowbite-svelte'
    import { CheckCircleSolid ,ExclamationCircleSolid, CloseCircleSolid, TrashBinSolid } from 'flowbite-svelte-icons';
    let toastList = toasts;
</script>



<div class="fixed top-4 right-4 z-50 space-y-2">
    {#each $toastList as { id, message, type }}
        {#if type === 'success'}
            <Toast color="green" transition={slide} class="fixed top-4 right-4 z-50 shadow-lg">
                <svelte:fragment slot="icon">
                    <CheckCircleSolid class="w-5 h-5" />
                    <span class="sr-only">Check icon</span>
                </svelte:fragment>
                {message}
            </Toast>
            {:else if type === 'error'}
            <Toast color="red" transition={slide} class="fixed top-4 right-4 z-50 shadow-lg">
                <svelte:fragment slot="icon">
                    <ExclamationCircleSolid class="w-5 h-5" />
                    <span class="sr-only">Check icon</span>
                </svelte:fragment>
                {message}
            </Toast>
            {:else if type === 'info'}
            <Toast color="blue" transition={slide} class="fixed top-4 right-4 z-50 shadow-lg">
                <svelte:fragment slot="icon">
                    <ExclamationCircleSolid class="w-5 h-5" />
                    <span class="sr-only">Check icon</span>
                </svelte:fragment>
                {message}
            </Toast>
            {:else if type === 'delete'}
            <Toast color="green" transition={slide} class="fixed top-4 right-4 z-50 shadow-lg">
                <svelte:fragment slot="icon">
                    <TrashBinSolid class="w-5 h-5" />
                    <span class="sr-only">Check icon</span>
                </svelte:fragment>
                {message}
            </Toast>
        {/if}
    {/each}
  </div>


