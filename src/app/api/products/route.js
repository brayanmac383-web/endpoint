import { NextResponse } from 'next/server';
import pool from '../../lib/db'; 

export async function POST(request) {
  let client;
  try {
    const { name, description, price, stock } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'El nombre del producto es obligatorio' },
        { status: 400 }
      );
    }

    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      return NextResponse.json(
        { error: 'El precio debe ser un número mayor a 0' },
        { status: 400 }
      );
    }

    client = await pool.connect();
    
    const result = await client.query(
      `INSERT INTO products (name, description, price, stock) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [
        name.trim(), 
        description ? description.trim() : null, 
        parseFloat(price), 
        stock ? parseInt(stock) : 0
      ]
    );

    const newProduct = result.rows[0];
    
    return NextResponse.json(
      { 
        message: 'Producto creado exitosamente', 
        product: newProduct 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creando producto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}

export async function GET() {
  let client;
  try {
    client = await pool.connect();
    
    const result = await client.query(`
      SELECT id, name, description, price, stock, created_at 
      FROM products 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      products: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}