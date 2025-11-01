import { serve } from 'https://deno.land/std@0.167.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://deno.land/x/resend@v1.1.0/mod.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

if (!RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not set.');
}
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase URL or Anon Key is not set.');
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { email, subject, message } = await req.json();

    if (!email || !subject || !message) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Send email using Resend
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      const { data: resendData, error: resendError } = await resend.emails.send({
        from: 'onboarding@resend.dev', // Replace with your verified sender email
        to: email,
        subject: subject,
        html: message,
      });

      if (resendError) {
        console.error('Error sending email via Resend:', resendError);
        return new Response(JSON.stringify({ message: `Error sending email: ${resendError.message}` }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        });
      } else {
        console.log('Email sent successfully via Resend:', resendData);
      }
    } else {
      console.warn('RESEND_API_KEY is not configured, skipping email sending.');
    }

    return new Response(JSON.stringify({ message: 'Email sent successfully (if configured).' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ message: `Internal Server Error: ${error.message}` }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});