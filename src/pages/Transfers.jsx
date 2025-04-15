import { useState } from 'react';
import { logTransfer, exportTransfersToCSV } from '../services/supabaseTransfers';

export default function Transfers() {
  const [form, setForm] = useState({
    item: '',
    quantity: '',
    unit: 'unidad',
    from_outlet: '',
    to_outlet: '',
    transferer_name: ''
  });

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const outlets = ['St Regis Bar', 'Jackie', 'Stella'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransfer = async () => {
    const { item, quantity, unit, from_outlet, to_outlet, transferer_name } = form;

    if (!item || !quantity || !from_outlet || !to_outlet || !transferer_name) {
      alert('Por favor completá todos los campos.');
      return;
    }

    await logTransfer({
      item,
      quantity: parseFloat(quantity),
      unit,
      from_outlet,
      to_outlet,
      transferer_name
    });

    alert('Transferencia registrada correctamente.');

    setForm({
      item: '',
      quantity: '',
      unit: 'unidad',
      from_outlet: '',
      to_outlet: '',
      transferer_name: ''
    });
  };

  const handleDownload = () => {
    if (!fromDate || !toDate) {
      alert('Seleccioná un rango de fechas para exportar.');
      return;
    }

    exportTransfersToCSV(fromDate, toDate);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-center mb-4">Registro de Transferencias</h1>

      <input
        name="item"
        type="text"
        placeholder="Producto"
        value={form.item}
        onChange={handleChange}
        className="w-full mb-2 p-2 rounded text-black"
      />

      <input
        name="quantity"
        type="number"
        placeholder="Cantidad"
        value={form.quantity}
        onChange={handleChange}
        className="w-full mb-2 p-2 rounded text-black"
      />

      <select
        name="unit"
        value={form.unit}
        onChange={handleChange}
        className="w-full mb-2 p-2 rounded text-black"
      >
        <option value="unidad">Unidad</option>
        <option value="kilo">Kilo</option>
        <option value="pack">Pack</option>
      </select>

      <select
        name="from_outlet"
        value={form.from_outlet}
        onChange={handleChange}
        className="w-full mb-2 p-2 rounded text-black"
      >
        <option value="">De qué barra</option>
        {outlets.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>

      <select
        name="to_outlet"
        value={form.to_outlet}
        onChange={handleChange}
        className="w-full mb-2 p-2 rounded text-black"
      >
        <option value="">A qué barra</option>
        {outlets.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>

      <input
        name="transferer_name"
        type="text"
        placeholder="Tu nombre"
        value={form.transferer_name}
        onChange={handleChange}
        className="w-full mb-4 p-2 rounded text-black"
      />

      <button
        onClick={handleTransfer}
        className="w-full p-2 bg-dark text-white rounded shadow"
      >
        Registrar Transferencia
      </button>

      <div className="mt-6">
        <label className="block mb-1">Desde:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="w-full p-2 mb-2 rounded text-black"
        />

        <label className="block mb-1">Hasta:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="w-full p-2 mb-2 rounded text-black"
        />

        <button
          onClick={handleDownload}
          className="w-full mt-2 p-2 bg-dark text-white rounded shadow"
        >
          Descargar CSV de Transferencias (por fecha)
        </button>
      </div>
    </div>
  );
}
