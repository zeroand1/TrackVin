import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';
import { processDB } from "$db/process";
import type { WithId } from "mongodb";


type process = {
    _id: WithId<string>;
    name: string;
};



export const load: PageServerLoad = async ({request}) => {
    const data = await processDB.find<process>({}, { limit: 50}).toArray();
    const serializedData = data.map(doc => ({
        _id: doc._id.toString(),
        name: doc.name
    }));
    return {process: serializedData};
}

export const actions = {
    default: async ({request}) => {
        const data = await request.formData()
        const payload = { name: data.get('name') }
        // console.log(data.get('name'))
        await processDB.insertOne(payload);
        return "Success"
    }
} satisfies Actions;