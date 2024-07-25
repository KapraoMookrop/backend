//src/app/api/route.js
//-------------------------------------------------------------------------------------
import { NextResponse } from 'next/server';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export async function GET() {
    try {
        const result = await client.query('SELECT * FROM tbl_user');
        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      //console.error(error);
      return new Response(JSON.stringify({ error: error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
}
//-------------------------------------------------------------------------------------
export async function POST() {
    try {
      return new Response(JSON.stringify({ message: "POST DATA OK"}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
}
//-------------------------------------------------------------------------------------
export async function PUT() {
    try {
      return new Response(JSON.stringify({ message: "PUT DATA OK"}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
}
//-------------------------------------------------------------------------------------
export async function DELETE() {
    try {
      return new Response(JSON.stringify({ message: "DELETE DATA OK"}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
}//-------------------------------------------------------------------------------------