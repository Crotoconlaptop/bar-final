import { useState, useEffect } from 'react';
import {
  crearPedido,
  getPedidos,
  recibirPedido
} from '../services/supabasePedidos';

export default function Orders() {
  const [form, setForm] = useState({
    requester_name: '',
    comments: '',
    products: [''],
    quantities: [''],
    units: ['unidad']
  });
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    const data = await getPedidos();
    setPedidos(data);
  };

  const handleChange = (index, field, value) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  const addProduct = () => {
    setForm({
      ...form,
      products: [...form.products, ''],
      quantities: [...form.quantities, ''],
      units: [...form.units, 'unidad']
    });
  };

  const removeProduct = (index) => {
    const newForm = { ...form };
    ['products', 'quantities', 'units'].forEach(key => {
      newForm[key] = form[key].filter((_, i) => i !== index);
    });
    setForm(newForm);
  };

  const handleSubmit = async () => {
    const { requester_name, comments, products, quantities, units } = form;
    if (!requester_name || products.some(p => !p) || quantities.some(q => !q)) {
      alert('Completá todos los campos necesarios');
      return;
    }
    await crearPedido({ requester_name, comments, products, quantities, units });
    setForm({ requester_name: '', comments: '', products: [''], quantities: [''], units: ['unidad'] });
    await loadPedidos();
  };

  const handleReceive = async (id, receiver_name, receive_comments) => {
    if (!receiver_name) return alert('Falta el nombre de quien recibe');
    await recibirPedido(id, receiver_name, receive_comments);
    await loadPedidos();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl text-center mb-4">Gestión de Pedidos</h1>

      <div className="bg-dark p-4 rounded mb-6">
        <h2 className="text-lg mb-2">Nuevo Pedido</h2>
        <input placeholder="Solicitado por" className="w-full mb-2 p-2 rounded text-black" value={form.requester_name} onChange={(e) => setForm({ ...form, requester_name: e.target.value })} />
        <input placeholder="Comentarios (opcional)" className="w-full mb-2 p-2 rounded text-black" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} />

        {form.products.map((_, i) => (
          <div key={i} className="mb-2">
            <input placeholder="Producto" className="w-full mb-1 p-1 rounded text-black" value={form.products[i]} onChange={(e) => handleChange(i, 'products', e.target.value)} />
            <div className="flex gap-2">
              <input placeholder="Cantidad" className="w-full p-1 rounded text-black" value={form.quantities[i]} onChange={(e) => handleChange(i, 'quantities', e.target.value)} />
              <select className="w-full p-1 rounded text-black" value={form.units[i]} onChange={(e) => handleChange(i, 'units', e.target.value)}>
                <option value="unidad">Unidad</option>
                <option value="kilo">Kilo</option>
                <option value="pack">Pack</option>
              </select>
              {form.products.length > 1 && <button onClick={() => removeProduct(i)} className="text-red-500">Eliminar</button>}
            </div>
          </div>
        ))}
        <button onClick={addProduct} className="text-blue-300 underline text-sm mb-2">+ Agregar otro producto</button>
        <button onClick={handleSubmit} className="w-full bg-dark text-white p-2 rounded shadow">Guardar Pedido</button>
      </div>

      <h2 className="text-xl mt-6 mb-2">Pedidos Pendientes</h2>
      {pedidos.filter(p => p.status === 'pendiente').map(p => (
        <div key={p.id} className="bg-dark p-2 rounded mb-4">
          <p><strong>Solicitado por:</strong> {p.requester_name}</p>
          {p.comments && <p><strong>Comentarios:</strong> {p.comments}</p>}
          <ul className="ml-4 list-disc">
            {p.products.map((product, idx) => (
              <li key={idx}>{product} - {p.quantities[idx]} {p.units[idx]}</li>
            ))}
          </ul>
          <RecepcionForm id={p.id} onReceive={handleReceive} />
        </div>
      ))}

      <h2 className="text-xl mt-6 mb-2">Pedidos Recibidos</h2>
      {pedidos.filter(p => p.status === 'recibido').map(p => (
        <div key={p.id} className="bg-dark p-2 rounded mb-4">
          <p><strong>Solicitado por:</strong> {p.requester_name}</p>
          {p.comments && <p><strong>Comentario solicitud:</strong> {p.comments}</p>}
          <ul className="ml-4 list-disc">
            {p.products.map((product, idx) => (
              <li key={idx}>{product} - {p.quantities[idx]} {p.units[idx]}</li>
            ))}
          </ul>
          <p><strong>Recibido por:</strong> {p.receiver_name}</p>
          {p.receive_comments && <p><strong>Comentario recepción:</strong> {p.receive_comments}</p>}
        </div>
      ))}
    </div>
  );
}

function RecepcionForm({ id, onReceive }) {
  const [receiver_name, setReceiver] = useState('');
  const [receive_comments, setComment] = useState('');

  return (
    <div className="mt-2">
      <input
        placeholder="Recibido por"
        value={receiver_name}
        onChange={(e) => setReceiver(e.target.value)}
        className="w-full mb-1 p-1 text-black rounded"
      />
      <input
        placeholder="Comentario (opcional)"
        value={receive_comments}
        onChange={(e) => setComment(e.target.value)}
        className="w-full mb-1 p-1 text-black rounded"
      />
      <button
        onClick={() => onReceive(id, receiver_name, receive_comments)}
        className="bg-green-600 text-white w-full rounded p-1"
      >
        Marcar como recibido
      </button>
    </div>
  );
}
