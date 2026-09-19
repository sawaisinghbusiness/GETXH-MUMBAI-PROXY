export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.headers['token'] || req.query.token;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  const targetUrl = new URL('https://payments-tesseract.bharatpe.in/api/v1/merchant/transactions');

  for (const [key, value] of Object.entries(req.query)) {
    if (key !== 'token') {
      targetUrl.searchParams.set(key, value);
    }
  }

  try {
    const bpRes = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'token': token,
        'accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });

    const status = bpRes.status;
    const contentType = bpRes.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await bpRes.json();
      return res.status(status).json(data);
    } else {
      const text = await bpRes.text();
      return res.status(status).send(text);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}
