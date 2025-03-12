import { materialDB } from "$db/material";
import type { WithId } from "mongodb";
import type { PageServerLoad, Actions } from "./$types";
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { schema } from './schema.js';


// export const load: PageServerLoad = async function(): Promise<{ BoM: {  _id: string, name: string }[] }> { 
//     const data = await BoM.find<BoMDocument>({}, { limit: 50}).toArray();
//     const serializedData = data.map(doc => ({
//         _id: doc._id.toString(),
//         name: doc.name
//     }));
//     console.log(serializedData);
//     return { BoM: serializedData };
// }

type material = {
    _id: WithId<string>;
    name: string;
	code: string;
	cost: number;
};

export const load = async () => {
	const form = await superValidate(zod(schema));
 	const data = await materialDB.find<material>({}, { limit: 50}).toArray();
	// console.log("Load Function Called")
	const serializedData = data.map(doc => ({
		_id: doc._id.toString(),
		name: doc.name,
		code: doc.code,
		cost: doc.cost
	}));
	console.log(serializedData)
	return { material: serializedData, form};
};
export const actions  = {
    default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));
		console.log(form);
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}
		else{
			console.log(form.data);
			let payload = structuredClone(form.data);
			await materialDB.insertOne(payload);
		}
		// TODO: Do something with the validated form.data
		return message(form, 'Form posted successfully!');
	}
} satisfies Actions




