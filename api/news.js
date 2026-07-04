export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { brand, country } = req.body;

  const countryNames = {
    ar: 'Argentina', mx: 'México', co: 'Colombia', cl: 'Chile',
    pe: 'Perú', uy: 'Uruguay', br: 'Brasil', es: 'España', us: 'Estados Unidos'
  };

  const countryName = countryNames[country] || 'Argentina';
  const language = country === 'br' ? 'pt' : country === 'us' ? 'en' : 'es';

  try {
    const query = encodeURIComponent(brand + ' ' + countryName);
    const url = `https://newsapi.org/v2/everything?q=${query}&language=${language}&sortBy=publishedAt&pageSize=5&apiKey=${process.env.NEWS_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json({ articles: data.articles || [] });
  } catch (error) {
    return res.status(200).json({ articles: [] });
  }
}
