<script lang="ts">
    import type { PageData } from './$types.js';
    export let data: PageData;
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell,TableSearch ,Button, Tooltip } from 'flowbite-svelte';  
    import { Heading } from 'flowbite-svelte';  
    import { CogOutline, CogSolid } from 'flowbite-svelte-icons';
</script>
<!-- {console.log(data)} -->
<div class="flex items-center justify-between">
    <Heading>Components</Heading>
    <a href="Component">
        <Button>Add new component</Button>
    </a>
</div>
<br>
<Table>
    <TableHead class="text-center">
        <TableHeadCell>Image</TableHeadCell>
        <TableHeadCell>Part Code</TableHeadCell>
        <TableHeadCell>Part Name</TableHeadCell>
        <TableHeadCell >Material</TableHeadCell>
        <TableHeadCell >Type</TableHeadCell>
        <TableHeadCell >Qty in Assembly</TableHeadCell>
        <TableHeadCell><span class="sr-only">View</span></TableHeadCell>
    </TableHead>  
    <TableBody tableBodyClass="divide-y">
        {#each data.component as component}
        <TableBodyRow class="text-center" >     
        {#if component.image}
            <TableBodyCell><a href={"/Costing/Component?id="+component._id.toString()} ><img src={component.image} alt={component.name} class="w-10 h-10 rounded-full" /></a></TableBodyCell>
        {:else}
            <TableBodyCell><a href={"/Costing/Component?id="+component._id.toString()} ><CogOutline/></a></TableBodyCell>
        {/if}
        <TableBodyCell>{component.code}</TableBodyCell>
        <TableBodyCell><div>{component.name}</div>{#if component.description}<Tooltip>{component.description}</Tooltip>{/if}</TableBodyCell>
        <TableBodyCell >{component.material?.name}</TableBodyCell>
        <TableBodyCell >{component.procurement.charAt(0).toUpperCase()+component.procurement?.slice(1)}</TableBodyCell>
        <TableBodyCell >{component.qty}</TableBodyCell>
        <TableBody class="text-center align-middle"><a href={"/Costing/Component?id="+component._id.toString()} class="font-medium text-primary-600 hover:underline dark:text-primary-500 ">View</a></TableBody>
        <!-- <TableBodyCell class="text-center">{component.totalCost.toFixed(2)}</TableBodyCell> -->
        </TableBodyRow>
        {/each}
    </TableBody>
</Table>