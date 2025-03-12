import { start_mongo } from "$db/mongo";

start_mongo().then((): void=>{
    console.log("Mongo Started.")
}).catch(e=>{console.error(e)})