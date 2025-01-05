import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { latitude, longitude } = await req.json()
    
    // Get API key from Supabase secrets
    const apiKey = Deno.env.get('OPENWEATHER_API_KEY')
    if (!apiKey) {
      throw new Error('Weather API key not found')
    }

    console.log('Fetching weather data for:', { latitude, longitude })
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('Weather API error:', response.status, await response.text())
      throw new Error(`Weather API responded with ${response.status}`)
    }

    const data = await response.json()
    console.log('Weather data fetched successfully')
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})