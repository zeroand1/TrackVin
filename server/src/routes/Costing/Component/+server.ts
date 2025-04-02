import { json } from '@sveltejs/kit';
import { componentDB } from "$db/component"; // Import your database connection
import { ObjectId } from 'mongodb';

export async function DELETE({ request }) {
    try {
        const { id } = await request.json();
        await componentDB.deleteOne({ _id: new ObjectId(id) });
        return json({ success: true });
    } catch (error) {
        return json({ success: false, error: error.message }, { status: 500 });
    }
}