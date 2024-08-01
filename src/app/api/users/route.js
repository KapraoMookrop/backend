//src/app/api/route.js
//-------------------------------------------------------------------------------------
import { NextResponse } from "next/server";
import { Client } from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export async function GET() {
  try {
    const result = await client.query("SELECT * FROM tbl_user");
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    //console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
//-------------------------------------------------------------------------------------
export async function POST(request) {
  try {
    const { firstname, lastname, username, password } = await request.json();
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //console.log(hashedPassword);
    const res = await client.query(
      "INSERT INTO tbl_user (firstname, lastname, username, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [firstname, lastname, username, hashedPassword]
    );
    return new Response(JSON.stringify(res.rows[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
//-------------------------------------------------------------------------------------
export async function PUT(request) {
  try {
    const { id, firstname, lastname, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await client.query(
      "UPDATE tbl_user SET firstname = $1, lastname = $2, password = $3 WHERE id = $4 RETURNING *",
      [firstname, lastname, hashedPassword, id]
    );
    if (res.rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(res.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
//-------------------------------------------------------------------------------------
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const res = await client.query(
      "DELETE FROM tbl_user WHERE id = $1 RETURNING *",
      [id]
    );
    if (res.rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(res.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 
