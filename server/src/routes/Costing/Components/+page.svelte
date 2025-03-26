<script lang="ts">
    import type { PageData } from './$types.js';
    export let data: PageData;
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell,TableSearch } from 'flowbite-svelte';  
    import { Heading } from 'flowbite-svelte';  
</script>
<!-- {console.log(data)} -->
<Heading>Components</Heading>
<Table>
    <TableHead class="text-center">
        <TableHeadCell>Component Code</TableHeadCell>
        <TableHeadCell>Component Name</TableHeadCell>
        <TableHeadCell >Material</TableHeadCell>
        <TableHeadCell >Type</TableHeadCell>
        <TableHeadCell >Qty in Assembly</TableHeadCell>
        <TableHeadCell><span class="sr-only">View</span></TableHeadCell>
    </TableHead>  
    <TableBody tableBodyClass="divide-y" >
        {#each data.component as component}
        <TableBodyRow class="text-center" > 
        <TableBodyCell>{component.code}</TableBodyCell>
        <TableBodyCell>{component.name}</TableBodyCell>
        <TableBodyCell >{component.material?.name}</TableBodyCell>
        <TableBodyCell >{component.procurement.charAt(0).toUpperCase()+component.procurement?.slice(1)}</TableBodyCell>
        <TableBodyCell >{component.qty}</TableBodyCell>
        <TableBody class="text-center align-middle"><a href={"/Costing/Component?id="+component._id.toString()} class="font-medium text-primary-600 hover:underline dark:text-primary-500 ">View</a></TableBody>
        <!-- <TableBodyCell class="text-center">{component.totalCost.toFixed(2)}</TableBodyCell> -->
        </TableBodyRow>
        {/each}
    </TableBody>
</Table>