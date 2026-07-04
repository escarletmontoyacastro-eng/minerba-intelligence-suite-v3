export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { brand, country } = req.body;

  try {
    const countryParam = country || 'ar';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(brand)}&language=es&sortBy=publishedAt&pageSize=5&apiKey=${process.env.NEWS_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json({ articles: data.articles || [] });
  } catch (error) {
    return res.status(200).json({ articles: [] });
  }
}
