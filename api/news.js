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

  let articles = [];

  // FUENTE 1: NewsData.io (mejor cobertura de medios argentinos)
  try {
    const newsdataUrl = `https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_KEY}&q=${encodeURIComponent(brand)}&country=${country}&language=${language}&size=5`;
    const newsdataRes = await fetch(newsdataUrl);
    const newsdataData = await newsdataRes.json();

    if (newsdataData.status === 'success' && newsdataData.results && newsdataData.results.length > 0) {
      articles = newsdataData.results.map(a => ({
        title: a.title,
        url: a.link || '',
        source: { name: a.source_id || 'Medio digital' },
        publishedAt: a.pubDate || ''
      }));
    }
  } catch (error) {
    console.error('NewsData.io error:', error);
  }

  // FUENTE 2: NewsAPI como respaldo si NewsData no encontró resultados
  if (articles.length === 0) {
    try {
      const query = encodeURIComponent(brand + ' ' + countryName);
      const newsapiUrl = `https://newsapi.org/v2/everything?q=${query}&language=${language}&sortBy=publishedAt&pageSize=5&apiKey=${process.env.NEWS_KEY}`;
      const newsapiRes = await fetch(newsapiUrl);
      const newsapiData = await newsapiRes.json();

      if (newsapiData.articles && newsapiData.articles.length > 0) {
        articles = newsapiData.articles.map(a => ({
          title: a.title,
          url: a.url || '',
          source: { name: a.source?.name || 'Medio digital' },
          publishedAt: a.publishedAt || ''
        }));
      }
    } catch (error) {
      console.error('NewsAPI error:', error);
    }
  }

  return res.status(200).json({ articles });
}


