export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Only POST allowed"
    });
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

  const tripComLink = buildTripComAffiliateLink({
    origin,
    destination,
    departureDate,
    returnDate,
    tripType,
    adults,
    children,
    infants,
    cabinClass
  });

  return res.status(200).json({
    ok: true,
    search: {
      origin,
      destination,
      departureDate,
      returnDate,
      tripType,
      adults,
      children,
      infants,
      cabinClass
    },
    providers: [
      {
        name: "Trip.com",
        deeplink: tripComLink,
        note: "Built from the passenger’s selected search."
      }
    ]
  });
}

function buildTripComAffiliateLink({
  origin,
  destination,
  departureDate,
  returnDate,
  tripType
}) {
  const params = new URLSearchParams({
    Allianceid: "8000938",
    SID: "302474901",
    trip_sub3: "M633096",
    departDate: departureDate,
    tripType: tripType === "round-trip" ? "RT" : "OW"
  });

  if (tripType === "round-trip" && returnDate) {
    params.set("returnDate", returnDate);
  }

  return `https://www.trip.com/flights/${origin}-${destination}/?${params.toString()}`;
}
