<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { Heading, P, A, Mark, Secondary } from 'flowbite-svelte';
    let finalCost : Number
    async function fetchData() {
        const response = await fetch('/Costing' ,{method: 'POST'});
        console.log(response)
        const data = await response.json();
        finalCost = data.finalCost
     }
</script>

<Heading>Costing</Heading>

<br>
<a href='Costing/Component/'><Button color="purple">Add new component</Button></a>
<a href='Costing/CreateMaterial'><Button color="purple">Add new material</Button></a>
<a href='Costing/CreateProcess'><Button color="purple">Add new Process</Button></a>
<br>
<br>
<br>
<br>
<br> 
<Button color="red" on:click={fetchData}>Calculate!</Button>

{console.log(finalCost)}
<!-- {#if finalCost}
    <p>{finalCost}</p>
{/if} -->




<style>
    h1{
        text-align: center;
    }
</style>