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

  const tripComLink = buildTripComAffiliateSearchLink({
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
        note: "Built from the exact search values entered by the passenger."
      }
    ]
  });
}

function buildTripComAffiliateSearchLink({
  origin,
  destination,
  departureDate,
  returnDate,
  tripType,
  adults,
  children,
  infants,
  cabinClass
}) {
  const baseUrl = "https://www.trip.com/flights/welcome/";

  const params = new URLSearchParams({
    to: "home",
    Allianceid: "8000938",
    SID: "302474901",
    trip_sub1: "",
    trip_sub3: "D14995878",

    // user-entered values
    from: origin,
    dest: destination,
    departDate: departureDate,
    tripType: tripType === "round-trip" ? "RT" : "OW",
    adults: String(adults || 1),
    children: String(children || 0),
    infants: String(infants || 0),
    cabinClass: cabinClass || "Economy"
  });

  if (tripType === "round-trip" && returnDate) {
    params.set("returnDate", returnDate);
  }

  return `${baseUrl}?${params.toString()}`;
}
