import { supabase } from '../supabase'

export async function getMyVehicles() {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('vehicles')
    .select('*, vehicle_modifications(*), vehicle_timeline(*)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function getVehicle(id) {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*, vehicle_modifications(*), vehicle_timeline(* )')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function createVehicle(vehicle) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('vehicles')
    .insert({ ...vehicle, owner_id: user.id })
    .select()
    .single()
  return { data, error }
}

export async function updateVehicle(id, updates) {
  const { data, error } = await supabase
    .from('vehicles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteVehicle(id) {
  const { error } = await supabase.from('vehicles').delete().eq('id', id)
  return { error }
}

export async function addModification(vehicleId, mod) {
  const { data, error } = await supabase
    .from('vehicle_modifications')
    .insert({ ...mod, vehicle_id: vehicleId })
    .select()
    .single()
  return { data, error }
}

export async function addTimelineEntry(vehicleId, entry) {
  const { data, error } = await supabase
    .from('vehicle_timeline')
    .insert({ ...entry, vehicle_id: vehicleId })
    .select()
    .single()
  return { data, error }
}
