import { BoM } from "$db/BoM";
import type {Actions } from "../$types";
import  { fail } from "@sveltejs/kit";

export const actions  = {
    addBoM: async ({cookies, request})  => {
        const data = await request.formData();
        const name = data.get('name');
        if (data.get('name')=="") {
            return fail (400, {missing: "name"});
        }
        await BoM.insertOne({ name: data.get('name') });
        return { success: true };
    }
} satisfies Actions