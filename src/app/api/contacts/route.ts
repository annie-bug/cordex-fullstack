import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";
import { contactSchema } from "@/lib/validation/contactSchema";
import {z} from "zod"

export async function GET(request: NextRequest){
    try{
        console.log("Connecting to MongoDB..")
        const client = await clientPromise;
        const db = client.db("cordex-db");
        const contacts = await db.collection("contacts").find({}).toArray();
        console.log("Fetched contacts: ", contacts);

        return new Response(JSON.stringify({contacts}), {
            status: 200,
            headers: {"Content-Type" : "application/json"},   
        })
    }catch(err){
        return new Response(JSON.stringify({err: "Failed to fetch contacts"}), {
            status: 500,
            headers: {"content-Type" : "aaplication/json"},
        })
    }
}

// export async function GET() {
//   return new Response("API route is working", { status: 200 });
// }

export async function POST(request: Request){
    try{
        //parse the incoming request body as json
        const body = await request.json();

        const parsed = contactSchema.safeParse(body);
        if(!parsed.success){
            const errors = parsed.error.issues.map(issue => issue.message);

            return new Response(JSON.stringify({errors}), 
            {status: 400, headers: {"Content-Type" : "application/json"}}
        );
        }

        const {name, email, phone} = body;

        //basic validation: check required fields
        if(!name || !email){
            return new Response(JSON.stringify({error: "Name and email are required."}),
            {status: 400, headers: {"Content-Type": "application/json"}}
        );
        }

        //connecting to db
        const client = await clientPromise;
        const db = client.db("cordex-db");


        //insert new document(row) into contacts table
        const result = await db.collection("contacts").insertOne({
            name, 
            email,
            phone: phone || null,
            createdAt: new Date(),
        });

        //respond with success message with new contact id
        return new Response(JSON.stringify({message: "Contact Created", contactId: result.insertedId}), {status: 201, headers: {"Content-Type": "application/json"}});
    }catch(err){
        console.error("Error in POST /contacts:", err)
        return new Response(JSON.stringify({err: "Failed to create Contact"}), {status: 500, headers: {"Content-Type" : "application/json"}});
    }
    
}