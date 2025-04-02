import { componentDB } from "$db/component";
import { ObjectId, type WithId } from "mongodb";
import type { PageServerLoad, Actions } from "./$types";
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { schema } from './schema.js';
import { materialDB } from "$db/material";
import { processDB } from "$db/process";
// import path from 'path';
// import { writeFile } from 'fs/promises';
// import { v4 as uuidv4 } from 'uuid';


type material = {
    _id: WithId<string>;
    name: string;
	code: string;
	cost: number;
};

type process = {
    _id: WithId<string>;
    name: string;
    type: string;
};

export const load: PageServerLoad= async ({request}) => {
    const url = new URL(request.url);
    const componentID =  url.searchParams.get('id')
    const form = await superValidate(zod(schema));
    const matData = await materialDB.find<material>({}, { limit: 50}).toArray();
        const processData = await processDB.find<process>({}, { limit: 50}).toArray();
        const serializedMat = matData.map(doc => ({
            _id: doc._id.toString(),
            name: doc.name,
            code: doc.code,
            cost: doc.cost
        }));
        const serializedProcess = processData.map(doc => ({
            _id: doc._id.toString(),
            name: doc.name,
            type: doc.type
        }));
        
    if(componentID){
        try{
            const data = await componentDB.find<WithId<any>>({_id:new ObjectId(componentID)}).toArray();
            const imageBinary = data[0].image; // Assuming `image` is stored as Binary in MongoDB
            let base64Image = null;
        
            if (imageBinary) {
                base64Image = `data:image/jpg;base64,${imageBinary.buffer.toString('base64')}`; 
                
                // Modify `image/png` if your images are JPEG or others
            }
            const serializedData = data.map(doc => ({
                _id: doc._id.toString(),
                code: doc.code,
                name: doc.name,
                qty: doc.qty,
                image: base64Image,
                material: doc.material,
                materialSupplied: doc.materialSupplied,
                yield: doc.yield,
                materialPerYield: doc.materialPerYield,
                description: doc.description,
                procurement: doc.procurement,
                processes: doc.processes,
                cost: doc.cost,
                totalCost: doc.totalCost
            }));
            return {material: serializedMat, process: serializedProcess, form, compData: serializedData[0]};
        }
        catch(e){
            return fail(400, { form });
        }
    }
        return { material: serializedMat, process: serializedProcess, form};
};
export const actions  = {
    default: async ({ request }) => {
        let totalCost: number = 0;
        const form = await superValidate(request, zod(schema));
        if(form.data.image){
            if (form.data._id && typeof(form.data.image) == 'string'){ // Use Case: Edit but image unchanged
                const file = form.data.image;
                console.log(file)
                console.log(file.split(','));
                const base64String = file.split(',')[1]; // Remove 'data:image/jpg;base64,' prefix
                const imageBuffer = Buffer.from(base64String, 'base64'); 
                console.log(imageBuffer);
                form.data.image = imageBuffer; 
            }
            else if(form.data.image.length <= 1){ // Use Case: Edit but image changed or New Entry 
                                                // (Condition Explaination: image is in object form in first element 
                                                // of single element array from file proxy) 
                                                // and not in storable array form
                const file = form.data.image[0]; 
                const buffer = Buffer.from(await file.arrayBuffer());
                form.data.image = buffer;
                
            }
            // Do nothing if to file.image if form not valid and image not changed
            
        }  
        if (!form.valid) {
            // Again, return { form } and things will just work.d
        
            return fail(400, { form });
        }
        else{
            console.log(form.data); 
            let payload:any = structuredClone(form.data);
            ////////////////Total calculation
            console.log("are u here yet?")
            if (payload.procurement === "manufactured") {
                let matObj =  await materialDB.find<material>({_id:new ObjectId(payload.material)}, { limit: 50}).toArray();
                if(payload.materialSupplied===false){
                    totalCost = ((payload.materialPerYield/payload.yield)*matObj[0].cost);
                }
                Object.keys(payload.processes).forEach((key) => {
                    totalCost += (payload.processes[key].cost/payload.processes[key].batchSize);
                });
                delete payload.cost;
            }
            else {
                delete payload.material;
                delete payload.yield;
                delete payload.materialPerYield;
                delete payload.processes;
                totalCost = payload.cost;
            }
            totalCost = totalCost*payload.qty;
            let final:any = payload;
            final['totalCost'] = totalCost;
            if (form.data._id){
                delete final._id;
                await componentDB.updateOne({_id: new ObjectId(form.data._id)}, {$set: final});
            }
            else{
                let reply = await componentDB.insertOne(final);	
                let returnID = reply.insertedId.toString();
                form.data._id = returnID
            }   
        }
        // TODO: Do something with the validated form.data
        return message(form, 'Form posted successfully!');
    }
} satisfies Actions




