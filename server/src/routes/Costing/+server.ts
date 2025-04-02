import { json } from '@sveltejs/kit';
import { componentDB } from "$db/component"; // Import your database connection
import { materialDB } from "$db/material";
import { processDB } from "$db/process";
import { ObjectId } from 'mongodb';
import { type WithId } from 'mongodb';


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

type material = {
    _id: WithId<string>;
    name: string;
    code: string;
    cost: number;
};





// export async function POST() {
//     try {
//         const data = await componentDB.find<Component>({}, { limit: 50 }).toArray();
//         let finalCost = 0
//         await Promise.all(data.map(async (payload) => {
//                         let totalCost = 0;
//                         if (payload.procurement === "manufactured") {
//                             let matObj =  await materialDB.find<material>({_id:new ObjectId(payload.material)}, { limit: 50}).toArray();
//                             if(payload.materialSupplied===false){
//                                 totalCost = ((payload.materialPerYield/payload.yield)*matObj[0].cost);
//                             }
//                             Object.keys(payload.processes).forEach((key) => {
//                                 totalCost += (payload.processes[key].cost/payload.processes[key].batchSize);
//                             });
//                             delete payload.cost;
//                         }
//                         else {
//                             delete payload.material;
//                             delete payload.yield;
//                             delete payload.materialPerYield;
//                             delete payload.processes;
//                             totalCost = payload.cost || 0;
//                         }
//                         totalCost = totalCost*payload.qty;
//                         ///////////
//                         finalCost = finalCost + totalCost;
//                         ///////////
//                         let final:any = payload;
//                         final['totalCost'] = totalCost;
//                         delete final._id;
//                         await componentDB.updateOne({_id: new ObjectId(payload._id)}, {$set: final});   
//         }));
//         return json({ success: true, finalCost });
//     }
//     catch (e) {
//         return json({ error: e.message });
//     }
// }




export async function POST() {
    try {
        const data = await componentDB.find({}, { limit: 50 }).toArray();
        let finalCost = 0;

        await Promise.all(
            data.map(async (payload) => {
                try {
                    let totalCost = 0;

                    if (payload.procurement === "manufactured") {
                        const matObj = await materialDB.findOne({ _id: new ObjectId(payload.material) });

                        if (matObj && payload.materialSupplied === false) {
                            totalCost += (payload.materialPerYield / payload.yield) * matObj.cost;
                        }

                        for (const key in payload.processes) {
                            totalCost += payload.processes[key].cost / payload.processes[key].batchSize;
                        }

                        delete payload.cost;
                    } else {
                        delete payload.material;
                        delete payload.yield;
                        delete payload.materialPerYield;
                        delete payload.processes;
                        totalCost = payload.cost;
                    }

                    totalCost *= payload.qty;
                    finalCost += totalCost;

                    let final = { ...payload, totalCost };
                    delete final._id; // Avoid modifying `_id` directly

                    await componentDB.updateOne({ _id: new ObjectId(payload._id) }, { $set: final });
                } catch (innerError) {
                    console.error(`Error processing component ${payload._id}:`, innerError);
                }
            })
        );

        return json({ success: true, finalCost });
    } catch (e) {
        console.error('Error in POST request:', e);
        return json({ error: e.message }, { status: 500 });
    }
}