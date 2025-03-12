<script lang='ts'>
    let {data , form} = $props();
</script>

<h1>Create a BoM</h1>

<form method="POST" action="?/addBoM">
    <input type="text" name="name" placeholder="Name" >
    {#if form?.missing =="name"}
        <p class="error">Name is required</p>
    {/if}
    <input type="text" name="description" placeholder="Description" >
    {#if form?.missing =="description"}
        <p class="error">Description is required</p>
    {/if}
    <br>

    <br> 
    <input type ='text' name="component" placeholder="Component">
    {#if form?.missing =="component"}
        <p class="error">Component is required</p>
    {/if}
    <input type = "number" name="quantity" placeholder="Quantity">
    {#if form?.missing =="quantity"}
        <p class="error">Quantity is required</p>
    {/if}
    <br>
    <br>
    <button>Add BoM</button>
</form>

