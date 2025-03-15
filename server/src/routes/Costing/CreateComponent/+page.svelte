<script lang='ts'>
	import { superForm } from 'sveltekit-superforms';
	let {data} = $props();
	const {form , errors, constraints, message, enhance} = superForm(data.form);
    let procurement = $state('manufactured');
    let selectedProcess: string[] = $state([]);
</script>


<h1>Add new Component type</h1>

{#if $message}<h3>{$message}</h3>{/if}

<form method="POST" use:enhance>
    <label for="code">Component Code:</label>
    <input type="text" name="code" placeholder="Component Code" aria-invalid={$errors.code ? 'true' : undefined} bind:value={$form.code} {...$constraints.code} >
    {#if $errors.code}<span class="invalid">{$errors.code}</span>{/if}
    <br>
    <br>
    <label for="name">Component Name:</label>
    <input type="text" name="name" placeholder="Component Name" aria-invalid={$errors.name ? 'true' : undefined} bind:value={$form.name}  {...$constraints.name}>
    {#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
    <br>
    <br>
    <label for="qty">Qty required in assembly:</label>   
    <input type="number" name="qty" placeholder="Qty required in assembly" aria-invalid={$errors.qty ? 'true' : undefined} bind:value={$form.qty} {...$constraints.qty}>
    {#if $errors.qty}<span class="invalid">{$errors.qty}</span>{/if}
    <br>
    <br>
    <label for="description">Component Material:</label>
    <select name="material">
        {#each data.material as material}
            <option value={material._id} title="{material.cost}-₹{material.cost}-{material.name}">{material.cost}-₹{material.cost}-{material.name}</option>
        {/each}
    </select>
    <br>
    <br>
    <label for="description">Component Description:</label>
    <textarea name="description" placeholder="Component Description" aria-invalid={$errors.description ? 'true' : undefined} bind:value={$form.description} {...$constraints.description}></textarea>
    {#if $errors.description}<span class="invalid">{$errors.description}</span>{/if}
    <br>
    <br>
    <label>
        <input type="radio" bind:group={procurement} value="manufactured" name="procurement"/>
        Manufactured
    </label>    
    <label>
        <input type="radio" bind:group={procurement} value="bought" name="procurement"/>
        Bought
    </label>
    {#if $errors.procurement}<span class="invalid">{$errors.procurement}</span>{/if}
    {#if $errors.cost}<span class="invalid">{$errors.cost}</span>{/if}
    {#if $errors.processes?._errors}<span class="invalid">{$errors.processes._errors[0]}</span>
        {console.log($errors)}
        {:else if $errors.processes}<span class="invalid">{$errors.processes}</span>
    {/if}
    <br>
    <br>
    {#if procurement === 'bought'}
            <label for="cost">Cost:</label>   
            <input type="number" name="cost" placeholder="Cost" aria-invalid={$errors.cost ? 'true' : undefined} bind:value={$form.cost} {...$constraints.cost}>
            <br>
            <br>    
        {:else}
            <p>Processes:</p>
            {#each data.process as process}
                <label>
                    <input type="checkbox" name="processes" bind:group={selectedProcess} value={process._id} />
                    {process.name}
                </label>
                <br>
            {/each}
            
    {/if}
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