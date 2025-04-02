<script lang='ts'>
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types.js';
  export let data: PageData;
	const {form , errors, constraints, message, enhance } = superForm(data.form , {
  invalidateAll: true,
});
import { Input, Label, Helper , P, Button , Heading} from 'flowbite-svelte';
import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from 'flowbite-svelte';

let editIndex = -1 
function editClick (index,material) { 
  editIndex = index
  $form.code = material.code
  $form.name = material.name
  $form.cost = material.cost
  
}
function update (material){
  
}
</script>


<Heading>Add new material type</Heading>

<br>
<br>

<form method="POST" use:enhance>
    <Label for = "code">Material code: </Label>
    <Input type="text" name="code" placeholder="Code" aria-invalid={$errors.code ? 'true' : undefined} bind:value={$form.code} {...$constraints.code} />
    {#if $errors.code}<span class="invalid">{$errors.code}</span>{/if}
  	<Label for = "name">Material name: </Label>
    <Input type="text" name="name" placeholder="Name" aria-invalid={$errors.name ? 'true' : undefined} bind:value={$form.name}  {...$constraints.name}/>
    {#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
    <Label for = "cost">Raw Cost per kg: ₹</Label>
    <Input type="number" name="cost" placeholder="Raw Cost per kg" aria-invalid={$errors.cost ? 'true' : undefined} bind:value={$form.cost} {...$constraints.cost}/>
    {#if $errors.cost}<span class="invalid">{$errors.cost}</span>{/if}
    <br>

    <br> 
    <br>
    <div class="flex">
      <Button class="ml-auto" type="submit">Add Material</Button>
    </div>
</form>

<br>
<form method="POST" use:enhance>
<Table>
  <TableHead>
    <TableHeadCell>Material Code</TableHeadCell>
    <TableHeadCell>Material Name</TableHeadCell>
    <TableHeadCell>Raw Cost per kg</TableHeadCell>
    <TableHeadCell>Edit</TableHeadCell>
  </TableHead>  
  <TableBody tableBodyClass="divide-y">
    {#each data.material as material,index}
    <TableBodyRow>
      <TableBodyCell>
        {#if editIndex == index} 
        <Input type="text" name="code" placeholder="Code" aria-invalid={$errors.code ? 'true' : undefined} bind:value={$form.code} {...$constraints.code} />
          {:else}
          {material.code}
        {/if}
      </TableBodyCell>
      <TableBodyCell>
        {#if editIndex == index} 
        <Input type="text" name="name" placeholder="Name" aria-invalid={$errors.name ? 'true' : undefined} bind:value={$form.name}  {...$constraints.name}/>
          {:else}
          {material.name}
        {/if}
      </TableBodyCell>
      <TableBodyCell>
        {#if editIndex == index} 
        <Input type="number" name="cost" placeholder="Raw Cost per kg" aria-invalid={$errors.cost ? 'true' : undefined} bind:value={$form.cost} {...$constraints.cost}/>
          {:else}
          ₹{material.cost}
        {/if}
        </TableBodyCell>
      <TableBodyCell>
        {#if editIndex < 0} 
          <Button on:click={()=>{editClick(index,material)}}>Edit</Button>
        {:else if editIndex == index}
          <Button on:click={()=>{editIndex=-1}} color='red'>Discard</Button>
          <Button type="submit">Update</Button> 
        {/if}
      </TableBodyCell>
    </TableBodyRow>
    {/each}
  </TableBody>
</Table>
</form>
{#if $message}<h3>{$message}</h3>{/if}

<style>
    h1{
        text-align: center;
    }
    .invalid {
		color: red;
	}
</style>