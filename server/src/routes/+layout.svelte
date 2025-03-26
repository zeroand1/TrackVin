<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { page } from '$app/state';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, SidebarDropdownItem, SidebarDropdownWrapper } from 'flowbite-svelte';
  	import { ChartPieSolid, GridSolid, CartSolid, MailBoxSolid, UserSolid, ArrowRightToBracketOutline, EditOutline, CashRegisterSolid, LayersOutline, HammerOutline	,CogOutline } from 'flowbite-svelte-icons';
	let activeUrl = page.url.pathname;
  	let activeClass = 'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700';
  	// let nonActiveClass = 'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700';
</script>


<div class="flex min-h-screen">
    <!-- Sidebar (Fixed on the Left) -->
    <div class="w-64 fixed top-0 left-0 h-full">
        <Sidebar>
			<SidebarWrapper>
				<SidebarGroup>
				  <SidebarItem label="Costing" href="/Costing">
					<svelte:fragment slot="icon">
					  <CashRegisterSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
					</svelte:fragment>
				  </SidebarItem>
				  <SidebarItem label="Components" href="/Costing/Components">
					<svelte:fragment slot="icon">
						<CogOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
					  </svelte:fragment>
				  </SidebarItem>
				  <SidebarItem label="Materials" href="/Costing/CreateMaterial">
					<svelte:fragment slot="icon">
					  <LayersOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
					</svelte:fragment>
				  </SidebarItem>
				  <SidebarItem label="Process" href="/Costing/CreateProcess">
					<svelte:fragment slot="icon">
					  <HammerOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
					</svelte:fragment>
				  </SidebarItem>
				</SidebarGroup>
			  </SidebarWrapper>
		</Sidebar>
    </div>

    <!-- Main Content (Pushes Right, Avoids Overlapping Sidebar) -->
    <div class="flex-1 ml-64 p-6">
		{@render children()}
    </div>
</div>


