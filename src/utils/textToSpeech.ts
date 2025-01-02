import { supabase } from "@/integrations/supabase/client";

const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah's voice ID

export async function speakText(text: string) {
  try {
    const { data: { secret: apiKey } } = await supabase.rpc('get_secret', { secret_name: 'ELEVEN_LABS_API_KEY' });
    
    if (!apiKey) {
      console.error('ElevenLabs API key not found');
      return;
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    await audio.play();

    // Clean up the URL after playing
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
  } catch (error) {
    console.error('Error in text-to-speech:', error);
  }
}