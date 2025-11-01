import { serve } from 'std/http/server.ts';
import { createClient } from 'supabase/supabase-js';
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
    const { name, username, company_name, email, plan } = await req.json();

    if (!name || !username || !email || !plan) {
      return new Response('Missing required fields', { status: 400 });
    }

    const supabaseClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

    // Save the subscription request to the database
    const { data, error: dbError } = await supabaseClient
      .from('subscription_requests')
      .insert([{ name, username, company_name, email, plan }]);

    if (dbError) {
      console.error('Error saving subscription request to DB:', dbError);
      return new Response(JSON.stringify({ message: `Database error: ${dbError.message}` }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Send email using Resend
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      const { data: resendData, error: resendError } = await resend.emails.send({
        from: 'onboarding@resend.dev', // Replace with your verified sender email
        to: email,
        subject: 'Thank You for Subscribing to SEO Engine AI!',
        html: `
            <p>Dear ${name},</p>
            <p>Thank you for subscribing to the <strong>${plan}</strong> plan on SEO Engine AI!</p>
            <p>We have received your request and will be in touch shortly with your payment link and credentials.</p>
            <p>In the meantime, if you have any questions, feel free to reply to this email.</p>
            <p>Best regards,</p>
            <p>The SEO Engine AI Team</p>
          `,
      });

      if (resendError) {
        console.error('Error sending email via Resend:', resendError);
        // Do not return error to client for email sending failure, as DB save was successful
      } else {
        console.log('Email sent successfully via Resend:', resendData);
      }
    } else {
      console.warn('RESEND_API_KEY is not configured, skipping email sending.');
    }

    return new Response(JSON.stringify({ message: 'Subscription request received and email sent (if configured).' }), {
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