import { supabase } from './supabaseClient';

export async function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target.result };
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 800 / img.width;
      canvas.width = 800;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob), 'image/webp', 0.75);
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadImageAndGetUrl(file, folder = 'premixes') {
  const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
  const compressed = await compressImage(file);

  const { error } = await supabase.storage
    .from('menu-images')
    .upload(`${folder}/${filename}`, compressed, {
      contentType: 'image/webp',
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('menu-images').getPublicUrl(`${folder}/${filename}`);
  return data.publicUrl;
}

export async function insertPremix({ name, ingredients, preparation, image_url }) {
  const { error } = await supabase.from('premixes').insert([{ name, ingredients, preparation, image_url }]);
  if (error) throw new Error(error.message);
}

export async function insertCocktail({ name, ingredients, preparation, image_url }) {
  const { error } = await supabase.from('cocktails').insert([{ name, ingredients, preparation, image_url }]);
  if (error) throw new Error(error.message);
}

export async function getPremixes() {
  const { data, error } = await supabase.from('premixes').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error cargando premixes:', error.message);
    return [];
  }
  return data;
}

export async function getCocktails() {
  const { data, error } = await supabase.from('cocktails').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error cargando cócteles:', error.message);
    return [];
  }
  return data;
}

export async function deletePremix(id) {
  const { error } = await supabase.from('premixes').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteCocktail(id) {
  const { error } = await supabase.from('cocktails').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
