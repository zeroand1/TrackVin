<script lang='ts'>
	import { superForm } from 'sveltekit-superforms';
	let {data} = $props();
	const {form , errors, constraints, message, enhance } = superForm(data.form , {
  invalidateAll: true,
});
import { Input, Label, Helper , P, Button , Heading} from 'flowbite-svelte';
import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from 'flowbite-svelte';
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
<Table>
  <TableHead>
    <TableHeadCell>Material Code</TableHeadCell>
    <TableHeadCell>Material Name</TableHeadCell>
    <TableHeadCell>Raw Cost per kg</TableHeadCell>
  </TableHead>  
  <TableBody tableBodyClass="divide-y">
    {#each data.material as material}
    <TableBodyRow>
      <TableBodyCell>{material.code}</TableBodyCell>
      <TableBodyCell>{material.name}</TableBodyCell>
      <TableBodyCell>₹{material.cost}</TableBodyCell>
    </TableBodyRow>
    {/each}
  </TableBody>
</Table>

{#if $message}<h3>{$message}</h3>{/if}

<style>
    h1{
        text-align: center;
    }
    .invalid {
		color: red;
	}
</style>