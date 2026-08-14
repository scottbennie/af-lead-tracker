exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { password } = JSON.parse(event.body || '{}');
  const correct = process.env.SITE_PASSWORD;

  if (!correct) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'SITE_PASSWORD not configured' }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: password === correct })
  };
};
