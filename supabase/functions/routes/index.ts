// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

type Coordinates= {latitude: number; longitude: number;};

Deno.serve(async (req) =>{

    const {origin:destination}:{
        origin:Coordinates;
        destination:Coordinates;}=await request.json();

    const response= await fetch(`https://routes.googleapis.com/directions/v2:computeRoutes?key=${Deno.env.get(' GOOGLE_MAPS_API_KEY')}`, {
    method:'POST',
    headers: {
        'Content-Type': 'application/json',
        "X-Goog-FieldMask":"routes.duration,routes.distanceMeters,routes.polylineEncodedPolyline",
    }
    body: JSON.stringify({
       origin:{
           location:{latlng:origin},
           destination:{location:{latlng: destination}
           },
       travelMode: "DRIVE",
       polylineEncoding: 'GEO_JSON_LINESTRING',
},
    ),
    },
);

    if (!response.ok) {
        const error = await response.json();
        console.error(error)
        throw new Error('HTTP error occured')}

        const data= await response.json();
        const res = data.routes[0]
        return new Response(
            JSON.stringify(res),
            { headers: { "Content-Type": "application/json" } },
        );
    });
    // Return the response from the Google Maps API

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/routes' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
