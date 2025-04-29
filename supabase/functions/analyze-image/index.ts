
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
    const MODEL_VERSION = new URL(req.url).searchParams.get("modelVersion") || "2";

    // Make sure we have the required API credentials
    if (!API_KEY || !MODEL_ID) {
      return new Response(
        JSON.stringify({ error: "API credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing image with model version: ${MODEL_VERSION}`);
    
    // Get the base64 image data from the request
    const { imageBase64, filename } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image data provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create FormData for Roboflow API
    const formData = new FormData();
    
    // Convert base64 back to a Blob and append to FormData
    const byteString = atob(imageBase64);
    const mimeType = "image/jpeg"; // Default to JPEG
    const ab = new Uint8Array(byteString.length);
    
    for (let i = 0; i < byteString.length; i++) {
      ab[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: mimeType });
    formData.append("file", blob, filename || "image.jpg");
    
    console.log(`Sending request to Roboflow API for model ${MODEL_ID}/${MODEL_VERSION}`);
    
    // Forward the request to Roboflow API
    const roboflowResponse = await fetch(
      `https://detect.roboflow.com/${MODEL_ID}/${MODEL_VERSION}?api_key=${API_KEY}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!roboflowResponse.ok) {
      const errorText = await roboflowResponse.text();
      console.error('Roboflow API error:', roboflowResponse.status, roboflowResponse.statusText, errorText);
      return new Response(
        JSON.stringify({ 
          error: `Roboflow API error: ${roboflowResponse.statusText}`,
          details: errorText
        }),
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
      JSON.stringify({ error: error.message, stack: error.stack }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
