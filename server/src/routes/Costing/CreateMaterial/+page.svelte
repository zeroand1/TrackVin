<script lang='ts'>
	import { superForm } from 'sveltekit-superforms';
	let {data} = $props();
	const {form , errors, constraints, message, enhance } = superForm(data.form , {
  invalidateAll: true,
});
</script>


<h1>Add new material type</h1>



<form method="POST" use:enhance>
    <label for = "code">Material code: </label>
    <input type="text" name="code" placeholder="Code" aria-invalid={$errors.code ? 'true' : undefined} bind:value={$form.code} {...$constraints.code} >
    {#if $errors.code}<span class="invalid">{$errors.code}</span>{/if}
  	<label for = "name">Material name: </label>
    <input type="text" name="name" placeholder="Name" aria-invalid={$errors.name ? 'true' : undefined} bind:value={$form.name}  {...$constraints.name}>
    {#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
    <label for = "cost">Raw Cost per kg: ₹</label>
    <input type="number" name="cost" placeholder="Raw Cost per kg" aria-invalid={$errors.cost ? 'true' : undefined} bind:value={$form.cost} {...$constraints.cost}>
    {#if $errors.cost}<span class="invalid">{$errors.cost}</span>{/if}
    <br>

    <br> 
    <br>
    <button>Add Material</button>
</form>


{#if $message}<h3>{$message}</h3>{/if}

{#each data.material as material}
{material.code} -
{material.name}
₹{material.cost}
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