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

  if (tripType === "round-trip" && !returnDate) {
    return res.status(400).json({
      ok: false,
      error: "Return date is required for round-trip"
    });
  }

  const tripComLink = buildTripComLink({
    origin,
    destination,
    departureDate,
    returnDate,
    tripType
  });

  const eDreamsLink = buildEDreamsLink({
    origin,
    destination,
    departureDate,
    returnDate,
    tripType
  });

  return res.status(200).json({
    ok: true,
    search: {
      origin,
      destination,
      departureDate,
      returnDate: tripType === "round-trip" ? returnDate : "",
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
        note: "Built from the exact route and dates the passenger selected."
      },
      {
        name: "eDreams",
        deeplink: eDreamsLink,
        note: "Built from the exact route and dates the passenger selected."
      }
    ]
  });
}

function buildTripComLink({
  origin,
  destination,
  departureDate,
  returnDate,
  tripType
}) {
  const params = new URLSearchParams({
    departDate: departureDate,
    tripType: tripType === "round-trip" ? "RT" : "OW"
  });

  if (tripType === "round-trip" && returnDate) {
    params.set("returnDate", returnDate);
  }

  return `https://www.trip.com/flights/${origin}-${destination}/?${params.toString()}`;
}

function buildEDreamsLink({
  origin,
  destination,
  departureDate,
  returnDate,
  tripType
}) {
  const params = new URLSearchParams({
    origin,
    destination,
    departureDate,
    tripType
  });

  if (tripType === "round-trip" && returnDate) {
    params.set("returnDate", returnDate);
  }

  return `https://www.edreams.com/?${params.toString()}`;
}
