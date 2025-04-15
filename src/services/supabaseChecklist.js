import { supabase } from './supabaseClient';

export async function logChecklistTask(task, doneBy, taskIndex) {
  const { error } = await supabase.from('checklist_logs').insert([
    {
      task,
      done_by: doneBy,
      task_index: taskIndex,
    },
  ]);
  if (error) {
    console.error('Error logging task:', error.message);
  }
}
