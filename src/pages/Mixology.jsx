import { useState, useEffect } from 'react';
import {
  insertPremix,
  insertCocktail,
  uploadImageAndGetUrl,
  getPremixes,
  getCocktails,
  deletePremix,
  deleteCocktail
} from '../services/supabaseMixology';

export default function Mixology() {
  const [form, setForm] = useState({
    name: '',
    ingredients: '',
    preparation: '',
    image: null
  });
  const [premixes, setPremixes] = useState([]);
  const [cocktails, setCocktails] = useState([]);
  const [isCocktail, setIsCocktail] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const premixData = await getPremixes();
      const cocktailData = await getCocktails();
      setPremixes(premixData);
      setCocktails(cocktailData);
    } catch (err) {
      console.error('Error al cargar:', err.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const image_url = await uploadImageAndGetUrl(form.image, isCocktail ? 'cocktails' : 'premixes');
      const data = { name: form.name, ingredients: form.ingredients, preparation: form.preparation, image_url };

      if (isCocktail) {
        await insertCocktail(data);
      } else {
        await insertPremix(data);
      }

      setForm({ name: '', ingredients: '', preparation: '', image: null });
      await loadData();
    } catch (err) {
      console.error('Error:', err.message);
      alert('Ocurrió un error al guardar.');
    }
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === 'premix') await deletePremix(id);
      if (type === 'cocktail') await deleteCocktail(id);
      await loadData();
    } catch (err) {
      console.error('Error al eliminar:', err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-center mb-4">Gestión de Mixología</h1>

      <div className="bg-dark p-4 rounded mb-6">
        <h2 className="text-xl mb-2">Agregar {isCocktail ? 'Cóctel' : 'Premix'}</h2>
        <input type="text" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mb-2 p-2 rounded text-black" />
        <input type="text" placeholder="Ingredientes" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="w-full mb-2 p-2 rounded text-black" />
        <input type="text" placeholder="Preparación" value={form.preparation} onChange={(e) => setForm({ ...form, preparation: e.target.value })} className="w-full mb-2 p-2 rounded text-black" />
        <input type="file" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} className="w-full mb-2" />
        <div className="flex justify-between items-center">
          <label>
            <input type="checkbox" checked={isCocktail} onChange={() => setIsCocktail(!isCocktail)} className="mr-2" />
            Es un cóctel
          </label>
          <button onClick={handleSubmit} className="bg-dark text-white px-4 py-2 rounded shadow">
            Guardar {isCocktail ? 'Cóctel' : 'Premix'}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl mt-4 mb-2">Premixes</h2>
        {premixes.length === 0 && <p className="text-gray-400">No hay premixes cargados.</p>}
        {premixes.map((p) => (
          <div key={p.id} className="bg-dark p-2 rounded mb-2">
            <h3 className="font-bold">{p.name}</h3>
            <p><strong>Ingredientes:</strong> {p.ingredients}</p>
            <p><strong>Preparación:</strong> {p.preparation}</p>
            {p.image_url && <img src={p.image_url} className="w-full rounded mt-2" />}
            <button onClick={() => handleDelete(p.id, 'premix')} className="mt-2 text-red-400 underline">Eliminar</button>
          </div>
        ))}

        <h2 className="text-xl mt-6 mb-2">Cócteles</h2>
        {cocktails.length === 0 && <p className="text-gray-400">No hay cócteles cargados.</p>}
        {cocktails.map((c) => (
          <div key={c.id} className="bg-dark p-2 rounded mb-2">
            <h3 className="font-bold">{c.name}</h3>
            <p><strong>Ingredientes:</strong> {c.ingredients}</p>
            <p><strong>Preparación:</strong> {c.preparation}</p>
            {c.image_url && <img src={c.image_url} className="w-full rounded mt-2" />}
            <button onClick={() => handleDelete(c.id, 'cocktail')} className="mt-2 text-red-400 underline">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
