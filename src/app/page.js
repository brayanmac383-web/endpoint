'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
      } else {
        alert('Error cargando productos: ' + data.error);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ ' + result.message);
        setFormData({ name: '', description: '', price: '', stock: '' });
        fetchProducts();
      } else {
        alert('❌ Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🛍️ Gestión de Productos</h1>
      
      {/* Formulario para crear producto */}
      <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>➕ Crear Nuevo Producto</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Nombre: *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label>Descripción:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '80px' }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label>Precio: *</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: loading ? '#ccc' : '#0070f3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creando...' : 'Crear Producto'}
          </button>
        </form>
      </div>

      {/* Lista de productos */}
      <div>
        <h2>📦 Lista de Productos ({products.length})</h2>
        
        {loading ? (
          <p>Cargando productos...</p>
        ) : products.length === 0 ? (
          <p>No hay productos registrados</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {products.map((product) => (
              <div key={product.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <h3>{product.name}</h3>
                <p><strong>Descripción:</strong> {product.description || 'N/A'}</p>
                <p><strong>Precio:</strong> ${product.price}</p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <p><strong>Creado:</strong> {new Date(product.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}