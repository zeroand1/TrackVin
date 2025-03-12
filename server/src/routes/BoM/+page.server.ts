import { BoM } from "$db/BoM";
import type { WithId } from "mongodb";
import type { PageServerLoad, Actions } from "./$types";



type BoMDocument = {
    _id: WithId<string>;
    name: string;
};

export const load: PageServerLoad = async function(): Promise<{ BoM: {  _id: string, name: string }[] }> { 
    const data = await BoM.find<BoMDocument>({}, { limit: 50}).toArray();
    const serializedData = data.map(doc => ({
        _id: doc._id.toString(),
        name: doc.name
    }));
    console.log(serializedData);
    return { BoM: serializedData };
}





