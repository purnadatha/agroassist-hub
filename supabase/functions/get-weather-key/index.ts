import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const api_key = Deno.env.get('TOMORROW_IO_API_KEY')
  
  return new Response(
    JSON.stringify({ api_key }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})