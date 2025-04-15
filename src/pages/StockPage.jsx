import { useState, useEffect } from 'react';

export default function StockPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    unit: 'unidad',
    category: '',
    quantity: ''
  });
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setCategories(storedCategories);
    setProducts(storedProducts);
  }, []);

  const saveData = (newCategories, newProducts) => {
    localStorage.setItem('categories', JSON.stringify(newCategories));
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    const updated = [...categories, newCategory.trim()];
    setCategories(updated);
    saveData(updated, products);
    setNewCategory('');
  };

  const deleteCategory = (cat) => {
    const updatedCategories = categories.filter(c => c !== cat);
    const updatedProducts = products.map(p =>
      p.category === cat ? { ...p, category: '' } : p
    );
    setCategories(updatedCategories);
    setProducts(updatedProducts);
    saveData(updatedCategories, updatedProducts);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addProduct = () => {
    const { name, unit, category, quantity } = form;
    if (!name.trim() || !unit || !quantity) return;
    const newProduct = { name: name.trim(), unit, category, quantity: parseFloat(quantity) };
    const updated = [...products, newProduct];
    setProducts(updated);
    saveData(categories, updated);
    setForm({ name: '', unit: 'unidad', category: '', quantity: '' });
  };

  const deleteProduct = (name) => {
    const updated = products.filter(p => p.name !== name);
    setProducts(updated);
    saveData(categories, updated);
  };

  const resetAll = () => {
    if (!confirm('¿Seguro que querés borrar todo el stock y categorías?')) return;
    setCategories([]);
    setProducts([]);
    localStorage.removeItem('categories');
    localStorage.removeItem('products');
  };

  const downloadCSV = () => {
    let csv = 'Producto,Categoría,Unidad,Cantidad\n';
    products.forEach(p => {
      csv += `${p.name},${p.category},${p.unit},${p.quantity}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'stock.csv';
    link.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').slice(1); // skip header
      const importedProducts = [];
      const importedCategories = new Set(categories);

      lines.forEach(line => {
        const [name, category, unit, quantity] = line.split(',').map(s => s?.trim());
        if (name && unit && quantity) {
          importedProducts.push({ name, category, unit, quantity: parseFloat(quantity) });
          if (category) importedCategories.add(category);
        }
      });

      const newCategories = Array.from(importedCategories);
      setCategories(newCategories);
      setProducts(importedProducts);
      saveData(newCategories, importedProducts);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center mb-6">Gestión de Stock</h1>

      <div className="mb-4 text-center">
        <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Categorías</h2>
        <div className="flex gap-2 mb-2">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nueva categoría"
            className="p-2 rounded text-black w-full"
          />
          <button onClick={addCategory} className="bg-green-600 text-white px-4 py-2 rounded">Agregar</button>
        </div>
        <ul>
          {categories.map(cat => (
            <li key={cat} className="flex justify-between bg-neutral-800 p-2 mb-1 rounded">
              <span>{cat}</span>
              <button onClick={() => deleteCategory(cat)} className="text-red-400 text-xs">Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Agregar Producto</h2>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="w-full p-2 mb-2 rounded text-black" />
        <select name="unit" value={form.unit} onChange={handleChange} className="w-full p-2 mb-2 rounded text-black">
          <option value="unidad">Unidad</option>
          <option value="kilo">Kilo</option>
          <option value="litro">Litro</option>
        </select>
        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 mb-2 rounded text-black">
          <option value="">Sin categoría</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="Cantidad" className="w-full p-2 mb-2 rounded text-black" />
        <button onClick={addProduct} className="w-full bg-dark text-white p-2 rounded shadow">Agregar</button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Productos</h2>
        <ul>
          {products.map(p => (
            <li key={p.name} className="bg-neutral-800 rounded p-2 mb-1 flex justify-between">
              <div>
                <strong>{p.name}</strong> — {p.quantity} {p.unit} [{p.category || 'Sin categoría'}]
              </div>
              <button onClick={() => deleteProduct(p.name)} className="text-red-400 text-xs">Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 justify-between">
        <button onClick={downloadCSV} className="bg-blue-600 text-white px-4 py-2 rounded">Descargar CSV</button>
        <button onClick={resetAll} className="bg-red-600 text-white px-4 py-2 rounded">Resetear todo</button>
      </div>
    </div>
  );
}
