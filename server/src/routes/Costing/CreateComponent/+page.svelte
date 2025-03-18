<script lang='ts'>
	import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types.js';
    import type { ObjectId } from 'mongodb';
    export let data: PageData;
    import SuperDebug from 'sveltekit-superforms';
    import { resolveRoute } from '$app/paths';
	const {form , errors, constraints, message, enhance} = superForm(data.form, {dataType: 'json' ,onUpdate: ({ result }) => {
            if (result.type === "success") {
                console.log("Form submitted successfully!");
                selectedProcesses = {};
            }
        }
    });
    let selectedProcesses: Record<string, { cost: number; batchSize: number }> = {};
    $form.material = "";
        // Toggle selection and initialize cost & batchSize
    function toggleProcess(processId: string) {
        if (selectedProcesses[processId]) {
            // Remove process if already selected
            const { [processId]: _, ...rest } = selectedProcesses;
            selectedProcesses = rest;
        } else {    
            // Add process with default values  
            selectedProcesses = {
                ...selectedProcesses,
                [processId]: { cost: 0, batchSize: 1 }
            };
        }
        $form.processes = selectedProcesses;
    }

    // Update cost or batchSize for a process
    function updateProcess(processId:string, field:string, value:number, index: number) {
        selectedProcesses = {
            ...selectedProcesses,
            [processId]: { ...selectedProcesses[processId], [field]: value }
        };
        console.log(selectedProcesses);
        // $form.processes = selectedProcesses;
    }
    
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
    {#if $errors.qty}<span class="invalid">{$errors.qty[0]}</span>{/if}
    <br>
    <br>
    <label for="description">Component Material:</label>
    <select name="material" bind:value={$form.material} {...$constraints.material}>
        <option disabled selected value={""} >Select Material</option>
        {#each data.material as material}
            <option value={material._id} title="{material.cost}-₹{material.cost}-{material.name}">{material.cost}-₹{material.cost}-{material.name}</option>
        {/each}
    </select>
    {#if $errors.material}<span class="invalid">{$errors.material}</span>{/if}
    <br>
    <br>
    <label for="material yield">
        Qty yield from material:
        <input type="number" name="materialYield" placeholder="Material Yield" aria-invalid={$errors.yield ? 'true' : undefined} bind:value={$form.yield} {...$constraints.yield}>
        per
    </label>
    <input type="number" name="materialPerYield" placeholder="Material used per yield" aria-invalid={$errors.materialPerYield ? 'true' : undefined} bind:value={$form.materialPerYield} {...$constraints.materialPerYield}> Kg
    {#if $errors.yield}<span class="invalid">{$errors.yield}</span>{/if}
    {#if $errors.materialPerYield}<span class="invalid">{$errors.materialPerYield}</span>{/if}
    <br>
    <br>
    <label for="description">Component Description:</label>
    <textarea name="description" placeholder="Component Description" aria-invalid={$errors.description ? 'true' : undefined} bind:value={$form.description} {...$constraints.description}></textarea>
    {#if $errors.description}<span class="invalid">{$errors.description}</span>{/if}
    <br>
    <br>
    <label>
        <input type="radio" name="procurement" bind:group={$form.procurement} value="manufactured" />
        Manufactured
    </label>    
    <label>
        <input type="radio" name="procurement" bind:group={$form.procurement} value="bought" />
        Bought
    </label>
    {#if $errors.procurement}<span class="invalid">{$errors.procurement}</span>{/if}
    <br>
    <br>
    {#if $form.procurement === 'bought'}
            <label for="cost">Cost:</label>   
            <input type="number" name="cost" placeholder="Cost" aria-invalid={$errors.cost ? 'true' : undefined} bind:value={$form.cost} {...$constraints.cost}>
            {#if $errors.cost}<span class="invalid">{$errors.cost}</span>{/if}
            <br>
            <br>    
        {:else}
            <input  name="processes" bind:value={$form.processes} type="hidden"/>
            <p>Processes:</p>
            {#if $errors.processes?._errors}<span class="invalid">{$errors.processes._errors[0]}</span>
             {console.log($errors)}
            {:else if $errors.processes}<span class="invalid">{$errors.processes}</span>
            {/if}
            {#each ['treatment','casting','machining', 'finishing', "testing"] as procType}
            <h3>{procType.charAt(0).toUpperCase() + procType.slice(1)}</h3>
                {#each data.process as processObj, index}
                    {#if processObj.type === procType}
                    <label>
                        <input 
                        type="checkbox" 
                        on:change={() => toggleProcess(processObj._id)} 
                        checked={processObj._id in selectedProcesses}
                    />
                    {processObj.name}
                    </label>
                    {#if processObj._id in selectedProcesses}
                        <label>
                            Cost: 
                            <input 
                                type="number"
                                bind:value={$form.processes[processObj._id].cost}
                                on:input={(e) => updateProcess(processObj._id, "cost", +e.currentTarget.value,index)}
                                min="0"
                            />
                        </label>
                        <label>
                            Batch Size: 
                            <input 
                                type="number" 
                                bind:value={$form.processes[processObj._id].batchSize}
                                on:input={(e) => updateProcess(processObj._id, "batchSize", + e.currentTarget.value,index)}
                                min="1"
                            />
                        </label>
                    {/if}
                    <br>
                    {/if}
                {/each}
            {/each}
            
    {/if}
    <button>Add Component</button>
</form>
<SuperDebug data={$form} />
<style>
    h1{
        text-align: center;
    }
    .invalid {
		color: red;
	}
</style>