import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const chatbotId = Deno.env.get('CHATBASE_ID')
  
  return new Response(
    JSON.stringify({ chatbotId }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})