//src/app/api/route.js
//-------------------------------------------------------------------------------------
import { Client } from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

function setCORSHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function GET() {
  try {
    const result = await client.query("SELECT * FROM tbl_user ORDER BY id ASC");
    const response = new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    return setCORSHeaders(response);
  } catch (error) {
    const response = new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
    return setCORSHeaders(response);
  }
}

export async function POST(request) {
  try {
    const { firstname, lastname, username, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await client.query(
      "INSERT INTO tbl_user (firstname, lastname, username, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [firstname, lastname, username, hashedPassword]
    );
    const response = new Response(JSON.stringify(res.rows[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
    return setCORSHeaders(response);
  } catch (error) {
    const response = new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
    return setCORSHeaders(response);
  }
}

export async function PUT(request) {
  try {
    const { user_id, firstname, lastname, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await client.query(
      "UPDATE tbl_user SET firstname = $1, lastname = $2, password = $3 WHERE id = $4 RETURNING *",
      [firstname, lastname, hashedPassword, user_id]
    );
    let response;
    if (res.rows.length === 0) {
      response = new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      response = new Response(JSON.stringify(res.rows[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return setCORSHeaders(response);
  } catch (error) {
    const response = new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
    return setCORSHeaders(response);
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const res = await client.query('DELETE FROM tbl_user WHERE id = $1 RETURNING *', [id]);
    let response;
    if (res.rows.length === 0) {
      response = new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      response = new Response(JSON.stringify(res.rows[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return setCORSHeaders(response);
  } catch (error) {
    const response = new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
    return setCORSHeaders(response);
  }
}

// Handle OPTIONS requests
export function OPTIONS() {
  const response = new Response(null, {
    status: 204,
    headers: { 'Content-Type': 'application/json' },
  });
  return setCORSHeaders(response);
}
