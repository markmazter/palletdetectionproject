
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const API_KEY = Deno.env.get("ROBOFLOW_API_KEY");
    const MODEL_ID = Deno.env.get("ROBOFLOW_MODEL_ID");
    const MODEL_VERSION = req.url.searchParams?.get("modelVersion") || "2";

    // Make sure we have the required API credentials
    if (!API_KEY || !MODEL_ID) {
      return new Response(
        JSON.stringify({ error: "API credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the image data from the request
    const formData = await req.formData();
    const imageFile = formData.get("file");

    if (!imageFile || !(imageFile instanceof File)) {
      return new Response(
        JSON.stringify({ error: "No image file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Forward the request to Roboflow API
    const roboflowFormData = new FormData();
    roboflowFormData.append("file", imageFile);
    
    const roboflowResponse = await fetch(
      `https://detect.roboflow.com/${MODEL_ID}/${MODEL_VERSION}?api_key=${API_KEY}`,
      {
        method: 'POST',
        body: roboflowFormData,
      }
    );

    if (!roboflowResponse.ok) {
      console.error('Roboflow API error:', roboflowResponse.status, roboflowResponse.statusText);
      return new Response(
        JSON.stringify({ error: `Roboflow API error: ${roboflowResponse.statusText}` }),
        { status: roboflowResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the response data from Roboflow
    const responseData = await roboflowResponse.json();
    console.log('Roboflow API response:', responseData);

    // Return the response to the client
    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error('Error in Edge Function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
