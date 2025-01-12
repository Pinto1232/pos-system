export default async function handler(req, res) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

  if (!apiUrl || !apiToken) {
    return res.status(500).json({ error: "Missing API URL or API token in environment variables" });
  }

  const endpoint = `${apiUrl}/PricingPackages`;
  console.log("Requesting endpoint:", endpoint);

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch data from the API' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}