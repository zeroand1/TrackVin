import { processDB } from "$db/process";
import type { WithId } from "mongodb";
import type { PageServerLoad, Actions } from "./$types";
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { schema } from './schema.js';
// import { processes} from '$stores/processes/';


type process = {
    _id: WithId<string>;
    name: string;
};


export const load: PageServerLoad = async () => { 
    const form = await superValidate(zod(schema));
    const data = await processDB.find<process>({}, { limit: 50}).toArray();
    // console.log("Load Function Called")
    const serializedData = data.map(doc => ({
        _id: doc._id.toString(),
        name: doc.name
    }));
    console.log(serializedData)
    return { process: serializedData, form};
}

export const actions  = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(schema));
        if (!form.valid) {
            // Again, return { form } and things will just work.
            return fail(400, { form });
        }
        else{
            console.log(form.data);
            let payload = structuredClone(form.data);
            await processDB.insertOne(payload);
        }
        // TODO: Do something with the validated form.data
        return message(form, 'Form posted successfully!');
    }
} satisfies Actions




