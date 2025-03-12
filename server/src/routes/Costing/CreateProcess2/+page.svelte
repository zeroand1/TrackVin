<script lang='ts'>
    import { enhance } from "$app/forms";
    let {data} = $props();
</script>

<form METHOD="POST" use:enhance>
    <input type="text" placeholder="Name" name="name" />
    <button> Update </button>
</form>

{#each data.process as item}
    {item.name}
    <br>
{/each}