<script lang='ts'>
	import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types.js';
    import type { ObjectId } from 'mongodb';
    export let data: PageData;
    import SuperDebug from 'sveltekit-superforms';
    import { resolveRoute } from '$app/paths';
    import { Input, Label, Helper , P, Button , Heading , Radio, Select, Textarea, Checkbox, Fileupload} from 'flowbite-svelte';
    import { PenSolid } from 'flowbite-svelte-icons';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell,TableSearch } from 'flowbite-svelte';   
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

    let fileInput: HTMLInputElement | null = null;;


    function handleFileUpload(event:Event){
        const target = event.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            const file = target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                document.querySelector("img")!.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }
    
</script>


<Heading>Add new Component type</Heading>
<br>

{#if $message}<h3>{$message}</h3>{/if}
<form method="POST" use:enhance class="max-w-4xl mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
    <!-- Profile Header -->
    <div class="flex items-center space-x-6">
        <!-- Profile Picture -->
        <div class="relative w-32 h-32 group">
            <button type="button" class="text-white text-xl" on:click={() => {fileInput? fileInput.click(): null}}>
            <!-- Hidden File Input -->
            <input type="file" accept="image/*" class="hidden" bind:this={fileInput} on:change={handleFileUpload} />
        
            <!-- Profile Image -->
            <img src="/add_image.svg" alt="Profile" class="w-full h-full rounded-lg border-4 border-white dark:border-gray-800 shadow-lg object-cover">
        
            <!-- Hover Effect: Pencil Icon -->
            <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PenSolid/>
                </div>
            </button>
        </div>
        <!-- Editable Name & Code -->
        <div class="text-left">
            <Input type="text" name="code" placeholder="Component Code" bind:value={$form.code}
            
                class="text-2xl font-bold bg-transparent focus:ring-2 dark:text-white w-full" {...$constraints.code}/>
            <Input type="text" name="name" placeholder="Component Name" bind:value={$form.name} 
                class="text-lg text-gray-500 bg-transparent focus:ring-2 dark:text-gray-400 w-full mt-1" {...$constraints.code}/>
        </div>
    </div>

    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Basic Info -->
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 class="text-lg font-semibold dark:text-white">Basic Info</h2>
            
            <Label for="qty" class="dark:text-gray-300">Qty in Assembly:</Label>   
            <Input type="number" name="qty" placeholder="Qty required" bind:value={$form.qty} {...$constraints.qty} class="w-full"/>
            {#if $errors.qty}<span class="invalid">{$errors.qty[0]}</span>{/if}
            {#if $form.procurement === 'manufactured'}
                <Label for="material" class="dark:text-gray-300">Material:</Label>
                <Select name="material" bind:value={$form.material} {...$constraints.material} class="w-full dark:bg-gray-700 dark:text-white">
                    {#each data.material as material}
                        <option value={material._id}>{material.name} - ₹{material.cost}</option>
                    {/each}
                </Select>
                {#if $errors.material}<span class="invalid">{$errors.material}</span>{/if}
            {/if}
            {#if $form.procurement === 'bought'}
            <Label for="cost" class="dark:text-gray-300">Cost:</Label>   
            <Input type="number" name="cost" placeholder="Cost" bind:value={$form.cost} {...$constraints.cost} class="w-full dark:bg-gray-700 dark:text-white"/>
            {#if $errors.cost}<span class="invalid">{$errors.cost}</span>{/if}
        {/if}
        </div>

        <!-- Procurement & Cost -->
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 class="text-lg font-semibold dark:text-white">Procurement</h2>
            <div class="flex gap-4">
                <Radio type="radio" name="procurement" bind:group={$form.procurement} value="manufactured">Manufactured</Radio>
                <Radio type="radio" name="procurement" bind:group={$form.procurement} value="bought">Bought</Radio>
            </div>
            {#if $errors.procurement}<span class="invalid">{$errors.procurement}</span>{/if}
            <br>

            {#if $form.procurement === 'manufactured'}
            <div class="flex items-end gap-4">
                <!-- First Input Block -->
                <div class="w-1/3">
                    <Label class="dark:text-gray-300 block" for="material yield">
                        Qty yield from material:
                    </Label>
                    <Input type="number" name="materialYield" placeholder="Material Yield" 
                        aria-invalid={$errors.yield ? 'true' : undefined} 
                        bind:value={$form.yield} {...$constraints.yield} 
                        class="w-full"/>
                </div>
            
                <!-- 'per' text vertically aligned with inputs -->
                <div class="pb-2"><P>per</P></div>
            
                <!-- Second Input Block (matching structure of first) -->
                <div class="w-1/3">
                    <Label class="dark:text-gray-300 invisible block">
                        Placeholder
                    </Label>
                    <Input type="number" name="materialPerYield" placeholder="Material used per yield" 
                        aria-invalid={$errors.materialPerYield ? 'true' : undefined} 
                        bind:value={$form.materialPerYield} {...$constraints.materialPerYield} 
                        class="w-full"/>
                </div>
            
                <!-- "Kg" text aligned properly -->
                <div class="pb-2"><P>Kg</P></div>
            </div>
            {/if}
            
            
            
        
        </div>
    </div>

    <!-- Processes Section (For Manufactured) -->
    {#if $form.procurement === 'manufactured'}
        <div class="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 class="text-lg font-semibold dark:text-white">Processes:</h2>
            {#if $errors.processes?._errors}<span class="invalid">{$errors.processes._errors[0]}</span>{/if}

            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                {#each ['treatment', 'casting', 'machining', 'finishing', 'testing'] as procType}
                    <div class="border p-4 rounded-md bg-white dark:bg-gray-700 shadow">
                        <h3 class="font-semibold mb-2 dark:text-white">{procType.charAt(0).toUpperCase() + procType.slice(1)}</h3>
                        {#each data.process as processObj}
                            {#if processObj.type === procType}
                                <Checkbox on:change={() => toggleProcess(processObj._id)} checked={processObj._id in selectedProcesses}>
                                    {processObj.name}
                                </Checkbox>

                                {#if processObj._id in selectedProcesses}
                                <div class="mt-2 flex gap-4 items-end">
                                    <div class="w-1/2">
                                        <Label class="dark:text-gray-300 block">{processObj.name} Cost:</Label>
                                        <Input type="number" bind:value={$form.processes[processObj._id].cost} class="w-full dark:bg-gray-700 dark:text-white"/>
                                    </div>
                                
                                    <div class="w-1/2">
                                        <Label class="dark:text-gray-300 block">{processObj.name} Batch Size:</Label>
                                        <Input type="number" bind:value={$form.processes[processObj._id].batchSize} class="w-full dark:bg-gray-700 dark:text-white"/>
                                    </div>
                                </div>
                                {/if}
                            {/if}
                        {/each}
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Submit Button -->
    <div class="sticky bottom-0 bg-gray-100 dark:bg-gray-800 p-4 flex justify-end">
        <Button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg">Save Changes</Button>
    </div>
</form>



<!-- <SuperDebug data={$form} /> -->
<style>
    h1{
        text-align: center;
    }
    .invalid {
		color: red;
	}
</style>