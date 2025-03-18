<script lang='ts'>
	import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types';
	export let data: PageData;
    let process = data.process;
    let type = "machining";
    const {form , errors, constraints, message, enhance } = superForm(data.form, {resetForm :    true});
    import { Input, Label, Helper , P, Button , Heading , Radio} from 'flowbite-svelte';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from 'flowbite-svelte';   
</script>   


<Heading>Add new Processs</Heading>


<br>

<form method="POST">
  	<Label for = "name">Process name: </Label>
    <Input type="text" name="name" placeholder="Name" aria-invalid={$errors.name ? 'true' : undefined} bind:value={$form.name}  {...$constraints.name} />
    {#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
    <br>
    <br> 
    <Label for = "type">Process type: </Label>
 
        <Radio name="type" value="treatment" bind:group = {type} > Treatment </Radio>

        <Radio name="type" value="casting" bind:group = {type} > Casting </Radio>

        <Radio name="type" value="machining" bind:group = {type} >Machining </Radio>
   
        <Radio name="type" value="finishing" bind:group = {type} >  Finishing </Radio>

        <Radio name="type" value="testing" bind:group = {type}  > Testing </Radio>
    
    <div class="flex">
        <Button type="submit" class="ml-auto mr-10">Add Process</Button>
    </div>
</form>
<br>
<div class="flex space-x-4">
    {#each ['treatment','casting','machining', 'finishing', "testing"] as procType}
    <div class="w-1/5">
        <Table>
            <TableHead>
                <tr>
                    <TableBodyCell>{procType.charAt(0).toUpperCase() + procType.slice(1)}</TableBodyCell>
                </tr>
            </TableHead>
            <TableBody tableBodyClass="divide-y">
                {#each process as process}
                    {#if process.type === procType}
                        <TableBodyRow>
                            <TableBodyCell>{process.name}</TableBodyCell>
                        </TableBodyRow>
                    {/if}
                {/each}
            </TableBody>
        </Table>
    </div>
    {/each}
</div>

<style>
    h1{
        text-align: center;
    }
    .invalid {
		color: red;
	}
</style>