import { componentDB} from "$db/component";
import { materialDB } from "$db/material";
import { processDB } from "$db/process";
import type { PageServerLoad, Actions } from "./$types";
import { Binary, ObjectId, type WithId } from "mongodb";




// Define the expected type of a component document
interface Component {
    _id: string;
    name: string;
    code: string;
    qty: number;
    image: any | null; // Can be a URL or null
    material?: string | null; // Can be an ObjectId string or null
    yield?: number;
    materialPerYield?: number;
    description?: string;
    procurement?: string;
    processes?: any; // Adjust type if needed
    cost?: number;
    totalCost?: number;
}

interface Material {
    _id: string;
    name: string;
    cost: number;
    // Add more fields if necessary
}

export const load: PageServerLoad = async () => {
    const data = await componentDB.find<Component>({}, { limit: 50 }).toArray();

    // Convert _id to string immediately
    const payload: Component[] = data.map(doc => ({
        ...doc,
        _id: doc._id.toString(), // Ensure _id is a string
        image : doc.image ?  `data:image/jpg;base64,${doc.image.buffer.toString('base64')}` : null,
        material: doc.material ? doc.material.toString() : null, // Ensure material is a string
    }));

    // Process material lookups in parallel
    const materialLookups = payload.map(async (doc) => {
        if (doc.material) {
            const material = await materialDB.findOne<Material>({ _id: new ObjectId(doc.material) });
            return {
                ...doc,
                material: material ? { ...material, _id: material._id.toString() } : null, // Convert material ID
            };
        }
        return doc;
    });

    // Wait for all lookups to finish
    const processedPayload = await Promise.all(materialLookups);

    return {
        component: processedPayload
    };
};