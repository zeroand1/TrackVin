<script lang='ts'>
	import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types';
	export let data: PageData;
    let process = data.process;
    const {form , errors, constraints, message, enhance } = superForm(data.form, {resetForm :    true});
</script>   


<h1>Add new Processs</h1>



<form method="POST">
  	<label for = "name">Process name: </label>
    <input type="text" name="name" placeholder="Name" aria-invalid={$errors.name ? 'true' : undefined} bind:value={$form.name}  {...$constraints.name}>
    {#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
    <br>
    <br> 
    <br>
    <button>Add Process</button>
</form>

{#each process as process}
    {process.name}
    <br>
{/each}

<style>
    h1{
        text-align: center;
    }
    .invalid {
		color: red;
	}
</style>