export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Only POST allowed" });
  }

  const {
    origin,
    destination,
    departureDate,
    returnDate,
    tripType,
    adults,
    children,
    infants,
    cabinClass
  } = req.body || {};

  if (!origin || !destination || !departureDate) {
    return res.status(400).json({
      ok: false,
      error: "Missing required fields"
    });
  }

  const results = [
    {
      provider: "Trip.com",
      airline: "IndiGo",
      origin: origin,
      destination: destination,
      departureAt: `${departureDate} 09:15`,
      arrivalAt: `${departureDate} 18:10`,
      returnAt: tripType === "round-trip" ? `${returnDate} 20:30` : null,
      stops: 1,
      cabinClass: cabinClass,
      adults: adults,
      children: children,
      infants: infants,
      price: 705,
      currency: "GBP",
      deeplink: "https://www.trip.com/"
    },
    {
      provider: "Trip.com",
      airline: "Air India",
      origin: origin,
      destination: destination,
      departureAt: `${departureDate} 11:40`,
      arrivalAt: `${departureDate} 21:10`,
      returnAt: tripType === "round-trip" ? `${returnDate} 17:00` : null,
      stops: 0,
      cabinClass: cabinClass,
      adults: adults,
      children: children,
      infants: infants,
      price: 754,
      currency: "GBP",
      deeplink: "https://www.trip.com/"
    }
  ];

  return res.status(200).json({
    ok: true,
    results
  });
}
