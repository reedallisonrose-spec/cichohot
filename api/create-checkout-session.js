// Serverless function for creating PayJSR checkout sessions
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Add CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get PayJSR secret key from env or legacy site_config field
    let payjsrSecretKey = process.env.PAYJSR_SECRET_KEY || '';
    if (!payjsrSecretKey) {
      const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
      if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
        return res.status(500).json({ error: 'Supabase not configured on server' });
      }
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });
      const { data: cfg, error: cfgErr } = await supabase
        .from('site_config')
        .select('stripe_secret_key')
        .limit(1)
        .maybeSingle();
      if (cfgErr) {
        console.error('Error fetching checkout secret key from Supabase:', cfgErr);
        return res.status(500).json({ error: 'Failed to fetch Stripe credentials from Supabase', details: cfgErr.message });
      }
      payjsrSecretKey = cfg?.stripe_secret_key || '';
    }
    
    if (!payjsrSecretKey) {
      return res.status(500).json({ error: 'PayJSR secret key not configured' });
    }
    
    const { amount, currency = 'eur', name, success_url, cancel_url } = req.body;
    
    if (!amount || !success_url || !cancel_url) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Create a random product name from a list
    const productNames = [
      "Personal Development Ebook",
      "Financial Freedom Ebook",
      "Digital Marketing Guide",
      "Health & Wellness Ebook",
      "Productivity Masterclass",
      "Mindfulness & Meditation Guide",
      "Entrepreneurship Blueprint",
      "Wellness Program",
      "Success Coaching",
      "Executive Mentoring",
      "Learning Resources",
      "Online Course Access",
      "Premium Content Subscription",
      "Digital Asset Package"
    ];
    
    // Select a random product name
    const randomProductName = productNames[Math.floor(Math.random() * productNames.length)];
    
    const payload = {
      amount: Math.round(amount),
      currency: String(currency || 'usd').toUpperCase(),
      description: name || randomProductName,
      billing_type: 'one_time',
      mode: 'redirect',
      success_url,
      cancel_url
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': payjsrSecretKey
      },
      body: JSON.stringify(payload)
    };

    let payjsrResponse = await fetch('https://api.payjsr.com/v1/payments', requestOptions);
    if (!payjsrResponse.ok && payjsrResponse.status === 404) {
      payjsrResponse = await fetch('https://api.payjsr.com/v1/api-create-payment', requestOptions);
    }

    const payjsrData = await payjsrResponse.json().catch(() => ({}));
    if (!payjsrResponse.ok) {
      return res.status(payjsrResponse.status).json({
        error: 'Failed to create PayJSR checkout session',
        details: payjsrData?.error || payjsrData?.message || 'Unknown PayJSR error'
      });
    }

    const normalized = payjsrData?.data || payjsrData;
    const sessionId = normalized?.payment_id || normalized?.session_id || normalized?.id;
    const checkoutUrl = normalized?.checkout_url || normalized?.url;
    if (!sessionId || !checkoutUrl) {
      return res.status(502).json({
        error: 'Invalid PayJSR response',
        details: 'Missing payment_id or checkout_url'
      });
    }

    res.status(200).json({ sessionId, checkoutUrl });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
}