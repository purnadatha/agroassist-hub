import { supabase } from "@/integrations/supabase/client";

const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah's voice ID

export async function speakText(text: string) {
  try {
    console.log("Fetching ElevenLabs API key...");
    const { data: apiKey, error } = await supabase.rpc('get_secret', {
      secret_name: 'ELEVEN_LABS_API_KEY'
    });

    if (error) {
      console.error('Error fetching ElevenLabs API key:', error);
      // If the error is about the secret not being found, provide a more helpful message
      if (error.message.includes('Secret ELEVEN_LABS_API_KEY not found')) {
        console.error('Please ensure the ELEVEN_LABS_API_KEY secret is set in your Supabase project settings.');
      }
      return;
    }

    if (!apiKey) {
      console.error('ElevenLabs API key not found in response');
      return;
    }

    console.log("API key fetched successfully, making request to ElevenLabs...");

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
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
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error('Failed to generate speech');
    }

    console.log("Speech generated successfully, playing audio...");
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    await audio.play();

    // Clean up the URL after playing
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      console.log("Audio playback completed");
    };
  } catch (error) {
    console.error('Error in text-to-speech:', error);
  }
}