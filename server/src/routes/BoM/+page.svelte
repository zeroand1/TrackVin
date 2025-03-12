<script lang='ts'>
    import type {PageData} from './$types'
    import Modal from '../../lib/components/Modal.svelte';
    import {goto} from '$app/navigation';
    let {data , form} = $props();
    console.log(form)
    let {BoM} = data as PageData;
</script>

<h1>
    Bill Of Materials   
</h1>

<button onclick = {()=>{goto("/BoM/create")}}>Add new BoM</button>
<br>

<form method="POST" action="?/addBoM">
    <input type="text" name="name" placeholder="Name" >
    {console.log(form)}dd
    <!-- {#if form?.missing =="name"}
        <p class="error">Name is required</p>
    {/if} -->
    <button>Add BoM</button>
</form>




{#each BoM as BoM}
    <a href={"/BoM/componentDetail/"+BoM.name}>{BoM.name}</a>
    <br>
{/each}
 