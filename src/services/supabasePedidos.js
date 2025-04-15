// ✅ supabasePedidos.js
import { supabase } from './supabaseClient';

// Crear pedido con arrays
export async function crearPedido({ requester_name, comments, products, quantities, units }) {
  const { error } = await supabase
    .from('pedidos')
    .insert([
      {
        requester_name,
        comments,
        products,
        quantities,
        units,
        status: 'pendiente',
        created_at: new Date().toISOString(),
      },
    ]);

  if (error) throw new Error('Error al crear pedido: ' + error.message);
}

// Obtener todos los pedidos
export async function getPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error('Error al obtener pedidos: ' + error.message);
  return data;
}

// Marcar pedido como recibido
export async function recibirPedido(id, receiver_name, receive_comments) {
  const { error } = await supabase
    .from('pedidos')
    .update({
      status: 'recibido',
      receiver_name,
      receive_comments,
      received_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error('Error al marcar como recibido: ' + error.message);
}