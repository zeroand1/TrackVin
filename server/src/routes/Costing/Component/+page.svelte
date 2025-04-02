<script lang='ts'>
	import { filesProxy, superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types.js';
    export let data: PageData;
    import SuperDebug from 'sveltekit-superforms';
    import { Input, Label, Helper , P, Button , Heading , Radio, Select, Textarea, Checkbox, Fileupload, Modal, Toast} from 'flowbite-svelte';
    import { PenSolid, TrashBinSolid, CheckCircleSolid} from 'flowbite-svelte-icons'; 
    import {page} from '$app/state';
    import { goto} from '$app/navigation';
    import { addToast } from '$lib/stores/toastStore.js';
    let editMode = true;
    let createMode = true;
    let failedCompFetch = false;
    let deleteModal = false;
    let queryParams = page.url.searchParams
    console.log(queryParams.get('id'));
    const componentID = queryParams.get('id');
    const {form , errors, constraints, message, enhance} = superForm(data.form, {dataType: 'json' ,onUpdate: async ({ result , form: returnForm}) => {
        if (result.type === "success") {
            console.log("Form submitted successfully!");
            selectedProcesses = {};
            $form.image = null;
            imagePreview = null;
            editMode = false;
            console.log(createMode)
            addToast("Component created successfully","success",10)
            try {
                await goto('/Costing/Component?id=' + returnForm.data._id);
                location.reload();
            } catch (error) {
                console.error("Navigation failed:", error);
            }
        }
        }
    });
    const file = filesProxy(form, 'image');
    let selectedProcesses: Record<string, { cost: number; batchSize: number }> = {};
    
    if(componentID || data.compData){
        console.log("fetching component")
        if (!data.compData) failedCompFetch = true;
        else {
            const compData = data.compData;
            $form.name = compData.name;
            $form.qty = compData.qty;
            $form.code = compData.code;
            $form.procurement = compData.procurement;
            $form.material = compData.material;
            $form.materialSupplied = compData.materialSupplied;
            $form.image = compData.image;
            $form.cost = compData.cost;
            $form.yield = compData.yield;
            $form.materialPerYield = compData.materialPerYield;
            $form.processes = compData.processes;
            $form.description = compData.description;
            selectedProcesses = compData.processes || [];
            $form._id = compData._id;
        }
        editMode = false;
        createMode = false;
        console.log(data.compData);
    }
    else{
        $form.material = "";
    }
    
    function toggleEdit(){
        editMode = !editMode;
        if(data.compData)
        {
            const compData = data.compData;
            $form.name = compData.name;
            $form.qty = compData.qty;
            $form.code = compData.code;
            $form.procurement = compData.procurement;
            $form.material = compData.material;
            $form.materialSupplied = compData.materialSupplied;
            $form.image = compData.image;
            $form.cost = compData.cost;
            $form.yield = compData.yield;
            $form.materialPerYield = compData.materialPerYield;
            $form.processes = compData.processes;
            $form.description = compData.description;
            selectedProcesses = compData.processes || [];
            $form._id = compData._id;
        }
        
    }
        // Toggle selection and initialize cost & batchSize
    function toggleProcess(processId: string) {
        if (selectedProcesses[processId]) {
            // Remove process if already selected
            const { [processId]: _, ...rest } = selectedProcesses;
            selectedProcesses = rest;
        } else {    
            console.log("before")
            // Add process with default values  
            console.log(selectedProcesses)
            selectedProcesses = {
                ...selectedProcesses,
                [processId]: { cost: 0, batchSize: 1 }
            };
            console.log("after")
            console.log(selectedProcesses)
            console.log
        }
        $form.processes = selectedProcesses;
    }

    // Update cost or batchSize for a process
    function updateProcess(processId:string, field:string, value:number) {
        selectedProcesses = {
            ...selectedProcesses,
            [processId]: { ...selectedProcesses[processId], [field]: value }
        };
        console.log(selectedProcesses);
        // $form.processes = selectedProcesses;
    }

    let imagePreview: string | null = null;

    
    function handleFileUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target.files || target.files.length === 0) return;

        const file = target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
        // $form.image=file;
        console.log($form.image)
        console.log(file)
    }

    let fileInput: HTMLInputElement | null = null; // Explicitly typed

    async function deleteComponent(id) {
        const response = await fetch('/Costing/Component', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

    const text = await response.text(); // Log raw response before JSON parsing
    console.log('Raw Response:', text);
        try {
            const result = JSON.parse(text);
            console.log('Parsed Response:', result);
            if (result.success) {
                addToast("Component deleted successfully","delete")
                goto('/Costing/Components');
            } else {
                alert('Delete failed: ' + result.error);
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            alert('Unexpected response from server');
        }
    }

    
    let toastStatus = false;
    let counter = 7;

    function trigger() {
        toastStatus = true;
        counter = 7;
        timeout();
    }

    function timeout() {
        if (--counter > 0) return setTimeout(timeout, 1000);
        toastStatus = false;
    }
    
</script>


<Heading>Add new Component type</Heading>
<br>

{#key editMode}
<form method="POST" enctype="multipart/form-data"  use:enhance class="max-w-4xl mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
    <!-- Profile Header -->
    <div class="flex items-center space-x-6">
        <!-- Profile Picture -->
        <div class="relative w-32 h-32 group">
            {#if editMode}
                <button type="button" class="text-white text-xl" on:click={() => fileInput?.click()}>
                <!-- Hidden File Input -->
                <input type="file" name="image" accept="image/png, image/jpeg"  class="hidden" on:change={handleFileUpload} bind:this={fileInput} bind:files={$file}  />

                {#if imagePreview}
                    <img src={imagePreview} alt="Preview" class="w-32 h-32 rounded-lg border object-cover" />
                {:else if $form.image && typeof($form.image) == 'string'} 
                    <img src = {$form.image} alt="Profile" class="w-32 h-32 rounded-lg border object-cover" />
                {:else}
                    <img src="/add_image.svg" alt="Profile" class="w-full h-full rounded-lg border-4 border-white dark:border-gray-800 shadow-lg object-cover">
                {/if}  
                
                <!-- Profile Image -->
            
                <!-- Hover Effect: Pencil Icon -->
                <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300">
                        <PenSolid/>
                    </div>
                </button>
                {:else}
                    {#if imagePreview}
                        <img src={imagePreview} alt="Preview" class="w-32 h-32 rounded-lg border object-cover" />
                    {:else if $form.image && typeof($form.image) == 'string'} 
                        <img src = {$form.image} alt="Profile" class="w-32 h-32 rounded-lg border object-cover" />
                    {:else}
                        <img src="/add_image.svg" alt="Profile" class="w-full h-full rounded-lg border-4 border-white dark:border-gray-800 shadow-lg object-cover">
                    {/if}  
            {/if}
        </div>
        <!-- Editable Name & Code -->
        <div class="text-left">
            {#if editMode}
            <Input type="text" name="code" placeholder="Part Number" bind:value={$form.code}
                class="text-2xl font-bold bg-transparent focus:ring-2 dark:text-white w-full" {...$constraints.code}/>
            <Input type="text" name="name" placeholder="Part Name" bind:value={$form.name} 
                class="text-lg text-gray-500 bg-transparent focus:ring-2 dark:text-gray-400 w-full mt-1" {...$constraints.code}/>
            {:else}
            <Heading class="text-2xl font-bold dark:text-white">{$form.code}</Heading>
            <br>
            <Heading class="text-lg text-gray-500 dark:text-gray-400">{$form.name}</Heading>
            {/if}
        </div>
        <div class="flex items-center gap-2 ml-auto">   
            {#if !createMode}
                {#if !editMode}
                    <Button on:click={toggleEdit} color='blue'><PenSolid/>Edit</Button>
                    {:else}
                    <Button on:click={toggleEdit} color='red'>Discard</Button>
                {/if}
            <Button on:click={()=>{deleteModal = true}}><TrashBinSolid/></Button>
            {/if}
        </div>
    </div>

    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Basic Info -->
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 class="text-lg font-semibold dark:text-white">Basic Info</h2>
            {console.log($errors)}
            <Label for="qty" class="dark:text-gray-300">Qty in Assembly:</Label>   
            <Input type="number" name="qty" placeholder="Qty required" disabled={!editMode} bind:value={$form.qty} {...$constraints.qty} class="w-full"/>
            {#if $errors.qty}<span class="invalid">{$errors.qty[0]}</span>{/if}
            {#if $form.procurement === 'manufactured'}
                <div class="flex items-center gap-2 dark:text-gray-300">
                    <Label for="material">Material:</Label> 
                    <Checkbox bind:checked={$form.materialSupplied} class='ml-auto' disabled={!editMode}> Supplied with process </Checkbox>
                </div>
                <Select name="material" bind:value={$form.material} {...$constraints.material} disabled={!editMode} class="w-full dark:bg-gray-700 dark:text-white">
                    {#each data.material as material}
                        <option value={material._id}>{material.code} {#if !$form.materialSupplied}- ₹{material.cost}{/if}</option>
                    {/each}
                </Select>
                {#if $errors.material}<span class="invalid">{$errors.material}</span>{/if}
                <br>
                
            {/if}
            {#if $form.procurement === 'bought'}
            <Label for="cost" class="dark:text-gray-300">Cost:</Label>   
            <Input type="number" step="any" name="cost" placeholder="Cost" bind:value={$form.cost} disabled={!editMode} {...$constraints.cost} class="w-full dark:bg-gray-700 dark:text-white"/>
            {#if $errors.cost}<span class="invalid">{$errors.cost}</span>{/if}
        {/if}
        </div>

        <!-- Procurement & Cost -->
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 class="text-lg font-semibold dark:text-white">Procurement</h2>
            <div class="flex gap-4">
                <Radio type="radio" name="procurement" bind:group={$form.procurement} value="manufactured" disabled={!editMode}>Manufactured</Radio>
                <Radio type="radio" name="procurement" bind:group={$form.procurement} value="bought" disabled={!editMode}>Bought</Radio>
            </div>
            {#if $errors.procurement}<span class="invalid">{$errors.procurement}</span>{/if}
            <br>

            {#if $form.procurement === 'manufactured'}
            {console.log("processssss")}
            <div class="flex items-end gap-4">
                <!-- First Input Block -->
                <div class="w-1/3">
                    <Label class="dark:text-gray-300 block" for="material yield">
                        Qty yield from material:
                    </Label>
                    <Input type="number" name="materialYield" placeholder="Material Yield" 
                        aria-invalid={$errors.yield ? 'true' : undefined} 
                        bind:value={$form.yield} {...$constraints.yield} 
                        disabled={$form.materialSupplied || !editMode}
                        class="w-full"/>
                </div>
            
                <!-- 'per' text vertically aligned with inputs -->
                <div class="pb-2"><P>per</P></div>
            
                <!-- Second Input Block (matching structure of first) -->
                <div class="w-1/3">
                    <Label class="dark:text-gray-300 invisible block">
                        Material used per yield
                    </Label>
                    <Input type="number" name="materialPerYield" placeholder="Material used per yield" 
                        aria-invalid={$errors.materialPerYield ? 'true' : undefined} 
                        bind:value={$form.materialPerYield} {...$constraints.materialPerYield} 
                        disabled={$form.materialSupplied || !editMode}
                        class="w-full"/>
                </div>
            
                <!-- "Kg" text aligned properly -->
                <div class="pb-2"><P>Kg</P></div>
            </div>
            {/if}

            
            
        
        </div>
    </div>

    <!-- Processes Section (For Manufactured) -->
    {#key $form.procurement}
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
                                <Checkbox on:change={() => toggleProcess(processObj._id)} checked={processObj._id in selectedProcesses} disabled={!editMode}>
                                    {processObj.name}
                                </Checkbox>

                                {#if processObj._id in selectedProcesses}
                                <div class="mt-2 flex gap-4 items-end">
                                    <div class="w-1/2">
                                        <Label class="dark:text-gray-300 block">{processObj.name} Cost:</Label>
                                        <Input type="number" step="0.01" on:change={(e) => updateProcess(processObj._id,'cost',$form.processes[processObj._id].cost)} bind:value={$form.processes[processObj._id].cost} min=0 required disabled={!editMode} class="w-full dark:bg-gray-700 dark:text-white"/>
                                    </div>
                                    
                                    <div class="w-1/2">
                                        <Label class="dark:text-gray-300 block">{processObj.name} Batch Size:</Label>
                                        <Input type="number" on:change={(e) => updateProcess(processObj._id,'batchSize',$form.processes[processObj._id].batchSize)} bind:value={$form.processes[processObj._id].batchSize} min=1  disabled={!editMode} required class="w-full dark:bg-gray-700 dark:text-white"/>
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
    {/key}

    <div class="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <Label>Description/Notes:<Textarea rows={10} bind:value={$form.description} disabled={!editMode}/></Label>
    </div>

    <!-- Submit Button -->
     {#if editMode}
        <div class="sticky bottom-0 bg-gray-100 dark:bg-gray-800 p-4 flex justify-end">
            <Button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg">Save Changes</Button>
        </div>
    {/if}
</form>
{/key}

<Modal title="Confirm Delete" bind:open={deleteModal} autoclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">Are you sure you want to delete this component?</p>
  <svelte:fragment slot="footer">
    <Button on:click={() => {deleteComponent($form._id)}}>Delete</Button>
    <Button color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>





<!-- <SuperDebug data={$form} /> -->
<style>
    h1{
        text-align: center;
    }
    .invalid {
		color: red;
	}
</style>