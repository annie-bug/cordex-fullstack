import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";
import { contactSchema } from "@/lib/validation/contactSchema";
import {json, z} from "zod"
import { ObjectId } from "mongodb";

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

export async function PUT(request: Request){
    try{
        //collecting the neccessary from the response
        const body = await request.json();
        const {id, name, email, phone} = body;

        //check to make sure id is not undefined or null
        if(!id){
            return new Response(JSON.stringify({error: "Contact id is required"}), {
                status: 400,
                headers: {"Content-Type" : "application/json"}
            });
        }

        //connect to db
        const client = await clientPromise;
        const db = client.db("cordex-db");

        //converting the id to ObjectId as mongodb understands this form of id
        //const contactId = new ObjectId(id) is deprecated
        const contactId = ObjectId.createFromHexString(id);

        //update contact
        const result = await db.collection("contacts").updateOne(
            {_id: contactId}, {$set: {name, email, phone: phone || null}}
        );

        
        if(result.matchedCount === 0){
            return new Response(JSON.stringify({error: "Contact not found"}), {
                status: 404,
                headers: {"Content-Type": "application/json"}
            })
        }

        return new Response(JSON.stringify({message: "Contact updated"}), {
            status: 200,
            headers: {"Content-Type": "application/json"}
        });
    }catch(error){
        return new Response(JSON.stringify({error: "Failed to update contact"}), {
            status: 500, 
            headers: {"Content-Type": "application/json"}
        });
    }
}

export async function DELETE(request: Request){
    try{
        const body = await request.json();
        const {id} = body;
        
        //check to make sure id is not undefined or null
        if(!id){
            return new Response(JSON.stringify({error: "Contact id is required"}), {
                status: 400,
                headers: {"Content-Type": "application/json"}
            });
        }
        
        //converting the id to ObjectId as mongodb understands this form of id
        //const contactId = new ObjectId(id) is deprecated
        const contactId = ObjectId.createFromHexString(id);

        //connecting to db
        const client = await clientPromise;
        const db = client.db("cordex-db");
        
        //deleting contact
        console.log("ID to delete:", id);
        const result = await db.collection("contacts").deleteOne({ _id: contactId });
        console.log("Delete result:", result);
        if(result.deletedCount === 0){
            return new Response(JSON.stringify({error: "Contact not found"}), {
                status: 404,
                headers: {"Content-Type" : "application/json"}
            });
        }

        return new Response(JSON.stringify({message: "Contact deleted"}), {
            status: 200,
            headers: {"Content-Type": "application/json"}
        });
    }catch(error){
        return new Response(JSON.stringify({error: "Failed to delete contact"}), {
            status: 500,
            headers: {"Content-Type": "application/json"}
        });
    }
}