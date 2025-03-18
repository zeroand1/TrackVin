<script lang='ts'>
	import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types';
	export let data: PageData;
    let process = data.process;
    let type = "machining";
    const {form , errors, constraints, message, enhance } = superForm(data.form, {resetForm :    true});
</script>   


<h1>Add new Processs</h1>



<form method="POST">
  	<label for = "name">Process name: </label>
    <input type="text" name="name" placeholder="Name" aria-invalid={$errors.name ? 'true' : undefined} bind:value={$form.name}  {...$constraints.name}>
    {#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
    <br>
    <br> 
    <label for = "type">Process type: </label>
    <label>
        <input type ="radio" name="type" value="treatment" bind:group = {type} >
        Treatment
    </label>
    <label>
        <input type ="radio" name="type" value="casting" bind:group = {type} >
        Casting
    </label>
    <label>
        <input type ="radio" name="type" value="machining" bind:group = {type} >
        Machining
    </label>
    <label>
        <input type ="radio" name="type" value="finishing" bind:group = {type} >
        Finishing
    </label>
    <label>
        <input type ="radio" name="type" value="testing" bind:group = {type} >
        Testing
    </label>
    <br>
    <button>Add Process</button>
</form>

{#each ['treatment','casting','machining', 'finishing', "testing"] as procType}
    <h3>{procType.charAt(0).toUpperCase() + procType.slice(1)}</h3>
    {#each process as process}
        {#if process.type === procType}
            {process.name}
            <br>
        {/if}
    {/each}
{/each}


<style>
    h1{
        text-align: center;
    }
    .invalid {
		color: red;
	}
</style>