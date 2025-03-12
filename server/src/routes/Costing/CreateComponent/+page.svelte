<script lang='ts'>
	import { superForm } from 'sveltekit-superforms';
	let {data} = $props();
    console.log(data.form)
	const {form , errors, constraints, message, enhance } = superForm(data.form);
</script>


<h1>Add new Component type</h1>

{#if $message}<h3>{$message}</h3>{/if}

<form method="POST" use:enhance>
    <label for="code">Component Code:</label>
    <input type="text" name="code" placeholder="Component Code" aria-invalid={$errors.code ? 'true' : undefined} bind:value={$form.code} {...$constraints.code} >
    {#if $errors.code}<span class="invalid">{$errors.code}</span>{/if}
    <label for="description">Component Description:</label>
    <input type="text" name="description" placeholder="Component Description" aria-invalid={$errors.description ? 'true' : undefined} bind:value={$form.description} {...$constraints.description}>
    {#if $errors.description}<span class="invalid">{$errors.description}</span>{/if}
    <label for="name">Component Name:</label>
    <input type="text" name="name" placeholder="Component Name" aria-invalid={$errors.name ? 'true' : undefined} bind:value={$form.name}  {...$constraints.name}>
    {#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
    <label for="qty">Qty required in assembly:</label>   
    <input type="number" name="qty" placeholder="Qty required in assembly" aria-invalid={$errors.qty ? 'true' : undefined} bind:value={$form.qty} {...$constraints.qty}>
    {#if $errors.cost}<span class="invalid">{$errors.cost}</span>{/if}
    <input>
    
    <br>
    <button>Add Component</button>
</form>



<style>
    h1{
        text-align: center;
    }
    .invalid {
		color: red;
	}
</style>