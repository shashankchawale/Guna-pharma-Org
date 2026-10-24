// Supabase Edge Function: send-welcome-email
// Triggered on new user registration in GUNA PHARMA

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, full_name, user_id } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Missing email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[Welcome Email] Dispatching to ${email} (Name: ${full_name || 'Customer'}, ID: ${user_id})`);

    // Here you can integrate Resend, SendGrid, or Supabase default mailer:
    // Example with Resend:
    // const res = await fetch("https://api.resend.com/emails", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
    //   },
    //   body: JSON.stringify({
    //     from: "GUNA PHARMA <support@gunapharma.com>",
    //     to: [email],
    //     subject: "Welcome to GUNA PHARMA - Your Trusted Healthcare Partner",
    //     html: `<p>Hello ${full_name || 'Valued Customer'},</p><p>Welcome to GUNA PHARMA!</p>`,
    //   }),
    // });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Welcome email triggered for ${email}`,
        recipient: email,
        name: full_name || "Valued Customer",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
