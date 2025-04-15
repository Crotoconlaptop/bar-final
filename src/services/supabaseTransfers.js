import { supabase } from './supabaseClient';

// ✅ Guarda una transferencia en Supabase
export async function logTransfer({
  item,
  from_outlet,
  to_outlet,
  quantity,
  unit,
  transferer_name
}) {
  const { error } = await supabase.from('transfers').insert([
    {
      item,
      from_outlet,
      to_outlet,
      quantity,
      unit,
      transferer_name
    }
  ]);

  if (error) {
    console.error('Error registrando transferencia:', error.message);
  }
}

// ✅ Exporta todas las transferencias como archivo CSV
export async function exportTransfersToCSV() {
  const { data, error } = await supabase
    .from('transfers')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error al obtener transferencias:', error.message);
    alert('Error al descargar las transferencias.');
    return;
  }

  const csvHeader = 'Producto,Cantidad,Unidad,Desde,Hacia,Responsable,Fecha\n';
  const csvRows = data.map(t => {
    const row = [
      `"${t.item}"`,
      t.quantity,
      t.unit,
      `"${t.from_outlet}"`,
      `"${t.to_outlet}"`,
      `"${t.transferer_name}"`,
      `"${new Date(t.timestamp).toLocaleString()}"`
    ];
    return row.join(',');
  });

  const csvContent = csvHeader + csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Transferencias_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}
