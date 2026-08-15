/* Seed realistic marketplace data across ZA, US, IN. Idempotent: skips if countries exist. */
import {
  db,
  pool,
  countriesTable,
  citiesTable,
  communitiesTable,
  serviceCategoriesTable,
  providersTable,
  providerCategoriesTable,
  reviewsTable,
  jobsTable,
  jobInterestsTable,
  adsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 3600 * 1000);
}

async function main() {
  const existing = await db.select().from(countriesTable);
  if (existing.length > 0) {
    console.log("Already seeded, skipping.");
    return;
  }

  // ---------------- Geography ----------------
  const [za, us, ind] = await db
    .insert(countriesTable)
    .values([
      { name: "South Africa", code: "ZA", currencyCode: "ZAR", currencySymbol: "R", flagEmoji: "🇿🇦" },
      { name: "United States", code: "US", currencyCode: "USD", currencySymbol: "$", flagEmoji: "🇺🇸" },
      { name: "India", code: "IN", currencyCode: "INR", currencySymbol: "₹", flagEmoji: "🇮🇳" },
    ])
    .returning();

  const cities = await db
    .insert(citiesTable)
    .values([
      { countryId: za!.id, name: "Johannesburg", region: "Gauteng" },
      { countryId: za!.id, name: "Pretoria", region: "Gauteng" },
      { countryId: za!.id, name: "Cape Town", region: "Western Cape" },
      { countryId: za!.id, name: "Durban", region: "KwaZulu-Natal" },
      { countryId: us!.id, name: "Austin", region: "Texas" },
      { countryId: us!.id, name: "Dallas", region: "Texas" },
      { countryId: us!.id, name: "New York", region: "New York" },
      { countryId: us!.id, name: "Atlanta", region: "Georgia" },
      { countryId: ind!.id, name: "Bengaluru", region: "Karnataka" },
      { countryId: ind!.id, name: "Mumbai", region: "Maharashtra" },
      { countryId: ind!.id, name: "Delhi", region: "Delhi NCR" },
      { countryId: ind!.id, name: "Hyderabad", region: "Telangana" },
    ])
    .returning();
  const city = (name: string) => cities.find((c) => c.name === name)!;

  const communities = await db
    .insert(communitiesTable)
    .values([
      { cityId: city("Johannesburg").id, name: "Sandton" },
      { cityId: city("Johannesburg").id, name: "Randburg" },
      { cityId: city("Johannesburg").id, name: "Fourways" },
      { cityId: city("Johannesburg").id, name: "Soweto" },
      { cityId: city("Johannesburg").id, name: "Roodepoort" },
      { cityId: city("Pretoria").id, name: "Centurion" },
      { cityId: city("Pretoria").id, name: "Hatfield" },
      { cityId: city("Cape Town").id, name: "Sea Point" },
      { cityId: city("Cape Town").id, name: "Claremont" },
      { cityId: city("Durban").id, name: "Umhlanga" },
      { cityId: city("Durban").id, name: "Berea" },
      { cityId: city("Austin").id, name: "Downtown Austin" },
      { cityId: city("Austin").id, name: "North Austin" },
      { cityId: city("Austin").id, name: "South Congress" },
      { cityId: city("Dallas").id, name: "Oak Lawn" },
      { cityId: city("New York").id, name: "Astoria" },
      { cityId: city("New York").id, name: "Park Slope" },
      { cityId: city("Atlanta").id, name: "Midtown Atlanta" },
      { cityId: city("Bengaluru").id, name: "Whitefield" },
      { cityId: city("Bengaluru").id, name: "Indiranagar" },
      { cityId: city("Bengaluru").id, name: "Koramangala" },
      { cityId: city("Mumbai").id, name: "Andheri West" },
      { cityId: city("Mumbai").id, name: "Bandra" },
      { cityId: city("Delhi").id, name: "Hauz Khas" },
      { cityId: city("Hyderabad").id, name: "Gachibowli" },
    ])
    .returning();
  const com = (name: string) => communities.find((c) => c.name === name)!;

  // ---------------- Categories ----------------
  const catDefs: [string, string, string][] = [
    ["Plumbing", "Home Maintenance", "wrench"],
    ["Electrical", "Home Maintenance", "zap"],
    ["Handyman", "Home Maintenance", "hammer"],
    ["Painting", "Home Maintenance", "paintbrush"],
    ["Roofing", "Home Maintenance", "home"],
    ["Tiling", "Home Maintenance", "grid-3x3"],
    ["Carpentry", "Home Maintenance", "axe"],
    ["Appliance Repair", "Home Maintenance", "refrigerator"],
    ["Air Conditioning", "Home Maintenance", "wind"],
    ["Pool Maintenance", "Home Maintenance", "waves"],
    ["Locksmith", "Home Maintenance", "key-round"],
    ["Gardening", "Home & Garden", "flower-2"],
    ["Landscaping", "Home & Garden", "trees"],
    ["Tree Cutting", "Home & Garden", "tree-pine"],
    ["Pest Control", "Home & Garden", "bug"],
    ["General Cleaning", "Home & Garden", "sparkles"],
    ["Deep Cleaning", "Home & Garden", "spray-can"],
    ["Carpet Cleaning", "Home & Garden", "layout-grid"],
    ["Domestic Helper", "Household Assistance", "heart-handshake"],
    ["Babysitter", "Household Assistance", "baby"],
    ["Pet Sitter", "Household Assistance", "paw-print"],
    ["Elderly Assistance", "Household Assistance", "heart-pulse"],
    ["Mechanic", "Automotive", "car"],
    ["Mobile Mechanic", "Automotive", "truck"],
    ["Car Wash", "Automotive", "droplets"],
    ["Towing", "Automotive", "life-buoy"],
    ["Furniture Transport", "Moving & Transport", "sofa"],
    ["Household Moving", "Moving & Transport", "package"],
    ["Waste Removal", "Moving & Transport", "trash-2"],
    ["Accountant", "Professional Services", "calculator"],
    ["IT Support", "Professional Services", "monitor"],
    ["Tutor", "Professional Services", "graduation-cap"],
    ["Photographer", "Professional Services", "camera"],
    ["Catering", "Events", "chef-hat"],
    ["Event Planning", "Events", "calendar-heart"],
    ["DJ", "Events", "music"],
    ["Hairdresser", "Personal Services", "scissors"],
    ["Beauty Services", "Personal Services", "sparkle"],
    ["Massage", "Personal Services", "hand"],
    ["Personal Trainer", "Personal Services", "dumbbell"],
  ];
  const cats = await db
    .insert(serviceCategoriesTable)
    .values(catDefs.map(([name, groupName, icon]) => ({ name, groupName, icon })))
    .returning();
  const cat = (name: string) => cats.find((c) => c.name === name)!;

  // ---------------- Providers ----------------
  type P = {
    businessName: string; providerType: string; tagline: string; description: string;
    community: string; verificationStatus: string; priceIndicator?: string;
    yearsActive?: number; serviceAreas: string[]; categories: string[];
  };
  const providerDefs: P[] = [
    // South Africa
    { businessName: "Thabo Plumbing Services", providerType: "sole_trader", tagline: "Fast, honest plumbing across northern Joburg", description: "Owner-run plumbing service with 12 years of experience in burst geysers, leaking taps, blocked drains and full bathroom installations. We quote before we work and clean up after ourselves.", community: "Randburg", verificationStatus: "verified", priceIndicator: "R450 call-out + parts", yearsActive: 12, serviceAreas: ["Randburg", "Sandton", "Fourways", "Roodepoort"], categories: ["Plumbing"] },
    { businessName: "QuickFix Plumbing", providerType: "small_business", tagline: "24/7 emergency plumbers, Johannesburg wide", description: "A team of four qualified plumbers handling emergencies day and night. Geysers, leaks, drains and solar conversions. COC certificates issued.", community: "Sandton", verificationStatus: "verified", priceIndicator: "From R550 call-out", yearsActive: 8, serviceAreas: ["Sandton", "Randburg", "Fourways"], categories: ["Plumbing"] },
    { businessName: "Joe Handyman", providerType: "individual", tagline: "No job too small in the north of Joburg", description: "Reliable handyman for hanging doors, fixing cupboards, small plumbing and electrical jobs, gutters and gates. Weekend work welcome.", community: "Fourways", verificationStatus: "verified", priceIndicator: "R350/hour", yearsActive: 5, serviceAreas: ["Fourways", "Randburg"], categories: ["Handyman", "Carpentry"] },
    { businessName: "Mokoena Electrical", providerType: "company", tagline: "Registered electricians, COCs and fault finding", description: "Registered electrical contractor. Distribution boards, fault finding, new circuits, compliance certificates and prepaid meters. Wireman's licence on file.", community: "Soweto", verificationStatus: "verified", priceIndicator: "R500 call-out", yearsActive: 15, serviceAreas: ["Soweto", "Roodepoort", "Randburg"], categories: ["Electrical"] },
    { businessName: "Sparkle Domestic Cleaning", providerType: "small_business", tagline: "Trusted home cleaning teams in Sandton & Rosebank", description: "Vetted, trained cleaning teams for weekly homes, deep cleans and move-in/move-out cleans. We bring our own equipment and supplies.", community: "Sandton", verificationStatus: "verified", priceIndicator: "R380 per cleaner/day", yearsActive: 6, serviceAreas: ["Sandton", "Randburg"], categories: ["General Cleaning", "Deep Cleaning"] },
    { businessName: "Green Thumb Gardens", providerType: "sole_trader", tagline: "Garden care that makes the neighbours jealous", description: "Weekly garden maintenance, instant lawn, irrigation repairs and seasonal planting. Serving Centurion and southern Pretoria.", community: "Centurion", verificationStatus: "verified", priceIndicator: "From R450/visit", yearsActive: 9, serviceAreas: ["Centurion"], categories: ["Gardening", "Landscaping"] },
    { businessName: "Cape Painters Co.", providerType: "small_business", tagline: "Interior & exterior painting done properly", description: "Prep-first painting company. Damp treatment, crack repairs and premium coatings for Atlantic Seaboard homes.", community: "Sea Point", verificationStatus: "verified", priceIndicator: "Quote per project", yearsActive: 11, serviceAreas: ["Sea Point", "Claremont"], categories: ["Painting", "Waterproofing" as string].filter(c => c !== "Waterproofing"), },
    { businessName: "Umhlanga Aircon Solutions", providerType: "company", tagline: "Cool homes, cold beer, happy families", description: "Supply, install and service split units and inverters. Regas and deep cleans. All work guaranteed for 12 months.", community: "Umhlanga", verificationStatus: "verified", priceIndicator: "R650 service/unit", yearsActive: 7, serviceAreas: ["Umhlanga", "Berea"], categories: ["Air Conditioning", "Appliance Repair"] },
    { businessName: "Sipho's Mobile Mechanics", providerType: "individual", tagline: "We come to you — brakes, services, diagnostics", description: "Qualified mechanic doing services, brakes, clutches and diagnostics at your home or office. Parts sourced same day.", community: "Soweto", verificationStatus: "pending", priceIndicator: "From R600 + parts", yearsActive: 4, serviceAreas: ["Soweto", "Roodepoort"], categories: ["Mobile Mechanic", "Mechanic"] },
    { businessName: "Zanele's Kitchen", providerType: "sole_trader", tagline: "Catering with heart for every celebration", description: "Full-service catering for weddings, funerals and corporate events. Traditional and modern menus from 20 to 500 guests.", community: "Berea", verificationStatus: "verified", priceIndicator: "From R180/head", yearsActive: 10, serviceAreas: ["Berea", "Umhlanga"], categories: ["Catering", "Event Planning"] },
    { businessName: "Pretoria Pool Care", providerType: "sole_trader", tagline: "Blue pools all year round", description: "Weekly pool maintenance, pump and chlorinator repairs, green-to-clean rescues. Chemicals included in monthly plans.", community: "Centurion", verificationStatus: "not_verified", priceIndicator: "R750/month", yearsActive: 3, serviceAreas: ["Centurion", "Hatfield"], categories: ["Pool Maintenance"] },
    { businessName: "Hatfield Tutors", providerType: "small_business", tagline: "Maths & science results you can measure", description: "One-on-one and small-group tutoring for Grades 8-12. Matric exam bootcamps. Tutors are vetted university graduates.", community: "Hatfield", verificationStatus: "verified", priceIndicator: "R280/hour", yearsActive: 5, serviceAreas: ["Hatfield", "Centurion"], categories: ["Tutor"] },
    { businessName: "Claremont Locksmiths", providerType: "sole_trader", tagline: "Locked out? We're 20 minutes away.", description: "Emergency lockouts, lock replacements, safes and security gate locks. 24/7 response in the southern suburbs.", community: "Claremont", verificationStatus: "verified", priceIndicator: "R400 call-out", yearsActive: 14, serviceAreas: ["Claremont", "Sea Point"], categories: ["Locksmith"] },
    { businessName: "Jozi Movers", providerType: "company", tagline: "Careful hands, honest prices, on time", description: "Household moves, furniture transport and office relocations across Gauteng. Blanket-wrapped, insured, and always on schedule.", community: "Roodepoort", verificationStatus: "verified", priceIndicator: "From R1,800/load", yearsActive: 8, serviceAreas: ["Roodepoort", "Randburg", "Sandton", "Soweto"], categories: ["Household Moving", "Furniture Transport"] },
    { businessName: "Braid Bar by Lerato", providerType: "individual", tagline: "Box braids, cornrows and crochet — at your home", description: "Mobile hairdresser specialising in protective styles. Bring the salon to your lounge. Weekend slots fill fast.", community: "Soweto", verificationStatus: "not_verified", priceIndicator: "From R450", yearsActive: 6, serviceAreas: ["Soweto"], categories: ["Hairdresser", "Beauty Services"] },

    // United States
    { businessName: "Hill Country Plumbing", providerType: "company", tagline: "Licensed master plumbers serving greater Austin", description: "Water heaters, repipes, slab leaks and remodels. Licensed, bonded and insured. Straightforward pricing before we start.", community: "North Austin", verificationStatus: "verified", priceIndicator: "$95 diagnostic", yearsActive: 18, serviceAreas: ["North Austin", "Downtown Austin", "South Congress"], categories: ["Plumbing"] },
    { businessName: "ATX Handyman Co.", providerType: "small_business", tagline: "Your honey-do list, done this week", description: "Drywall, fences, decks, TV mounting, door repairs and more. Two-hour minimum, transparent hourly rate, photos when the job is done.", community: "South Congress", verificationStatus: "verified", priceIndicator: "$85/hour", yearsActive: 6, serviceAreas: ["South Congress", "Downtown Austin"], categories: ["Handyman", "Carpentry"] },
    { businessName: "Lone Star Electric", providerType: "company", tagline: "Austin's on-time electricians", description: "Panel upgrades, EV chargers, lighting and troubleshooting. Master electrician on every job. Same-week scheduling.", community: "Downtown Austin", verificationStatus: "verified", priceIndicator: "$120 first hour", yearsActive: 12, serviceAreas: ["Downtown Austin", "North Austin"], categories: ["Electrical"] },
    { businessName: "Maria's Cleaning Crew", providerType: "sole_trader", tagline: "A spotless home without lifting a finger", description: "Family-run cleaning service. Weekly, bi-weekly and deep cleans with eco-friendly products. Same crew every visit.", community: "Oak Lawn", verificationStatus: "verified", priceIndicator: "From $130/visit", yearsActive: 9, serviceAreas: ["Oak Lawn"], categories: ["General Cleaning", "Deep Cleaning"] },
    { businessName: "Brooklyn Stoop Movers", providerType: "small_business", tagline: "Walk-ups are our specialty", description: "Apartment moves across Brooklyn and Queens. Fourth-floor walk-up? No problem. Flat quotes, no surprises on moving day.", community: "Park Slope", verificationStatus: "verified", priceIndicator: "From $480/move", yearsActive: 7, serviceAreas: ["Park Slope", "Astoria"], categories: ["Household Moving", "Furniture Transport"] },
    { businessName: "Astoria Appliance Repair", providerType: "individual", tagline: "Fridges, washers, dryers — fixed today", description: "Factory-trained technician for all major appliance brands. Most repairs completed on the first visit with parts on the truck.", community: "Astoria", verificationStatus: "verified", priceIndicator: "$75 diagnostic", yearsActive: 11, serviceAreas: ["Astoria"], categories: ["Appliance Repair"] },
    { businessName: "Peach State Lawn Pros", providerType: "small_business", tagline: "Atlanta lawns that stop traffic", description: "Mowing, edging, seasonal color, sod and irrigation. Serving Midtown and surrounding neighborhoods on weekly routes.", community: "Midtown Atlanta", verificationStatus: "verified", priceIndicator: "From $45/cut", yearsActive: 8, serviceAreas: ["Midtown Atlanta"], categories: ["Gardening", "Landscaping"] },
    { businessName: "Dallas Mobile Detail", providerType: "individual", tagline: "Showroom shine in your driveway", description: "Full interior and exterior detailing at your home or office. Ceramic coatings and paint correction available.", community: "Oak Lawn", verificationStatus: "not_verified", priceIndicator: "From $120", yearsActive: 3, serviceAreas: ["Oak Lawn"], categories: ["Car Wash"] },
    { businessName: "NYC Tech Tutors", providerType: "small_business", tagline: "Patient tech help for every generation", description: "In-home IT support and tutoring: new laptops set up, WiFi fixed, scams removed, grandparents trained. Friendly and jargon-free.", community: "Park Slope", verificationStatus: "verified", priceIndicator: "$90/hour", yearsActive: 5, serviceAreas: ["Park Slope", "Astoria"], categories: ["IT Support", "Tutor"] },
    { businessName: "Austin Event Snappers", providerType: "individual", tagline: "Natural photos, zero awkward posing", description: "Event and family photographer with a photojournalistic style. Weddings, birthdays, corporate events and headshots.", community: "Downtown Austin", verificationStatus: "pending", priceIndicator: "From $350/event", yearsActive: 4, serviceAreas: ["Downtown Austin", "South Congress"], categories: ["Photographer"] },
    { businessName: "Midtown Fitness Coaching", providerType: "individual", tagline: "Strength coaching that fits your life", description: "Certified personal trainer offering in-home and park sessions. Programs for beginners, busy parents and over-50s.", community: "Midtown Atlanta", verificationStatus: "verified", priceIndicator: "$70/session", yearsActive: 6, serviceAreas: ["Midtown Atlanta"], categories: ["Personal Trainer"] },

    // India
    { businessName: "Sharma Plumbing Works", providerType: "sole_trader", tagline: "Whitefield's most recommended plumber", description: "Tap repairs, bathroom fittings, water tank cleaning, motor and pipeline work. Same-day visits across Whitefield.", community: "Whitefield", verificationStatus: "verified", priceIndicator: "₹300 visit charge", yearsActive: 13, serviceAreas: ["Whitefield"], categories: ["Plumbing"] },
    { businessName: "Bright Spark Electricals", providerType: "small_business", tagline: "Licensed electricians for homes & offices", description: "Wiring, inverter installation, MCB tripping issues, fan and geyser fitting. Two-hour response window in Indiranagar and Koramangala.", community: "Indiranagar", verificationStatus: "verified", priceIndicator: "₹250 + materials", yearsActive: 9, serviceAreas: ["Indiranagar", "Koramangala"], categories: ["Electrical"] },
    { businessName: "UrbanNest Deep Clean", providerType: "company", tagline: "Move-in ready homes in a single day", description: "Professional deep cleaning with industrial machines: kitchens, bathrooms, sofa shampooing and full-home packages.", community: "Koramangala", verificationStatus: "verified", priceIndicator: "From ₹2,499", yearsActive: 5, serviceAreas: ["Koramangala", "Indiranagar", "Whitefield"], categories: ["Deep Cleaning", "General Cleaning", "Carpet Cleaning"] },
    { businessName: "Bandra Carpenter Bros", providerType: "small_business", tagline: "Custom wardrobes and honest repairs", description: "Two brothers, twenty years of carpentry. Modular wardrobes, bed repairs, door alignment and polish work.", community: "Bandra", verificationStatus: "verified", priceIndicator: "₹500/visit adjustable", yearsActive: 20, serviceAreas: ["Bandra", "Andheri West"], categories: ["Carpentry", "Handyman"] },
    { businessName: "CoolBreeze AC Services", providerType: "company", tagline: "AC service in 90 minutes, guaranteed", description: "Split and window AC servicing, gas refill, installation and AMC plans. Technicians background-verified.", community: "Andheri West", verificationStatus: "verified", priceIndicator: "₹499/service", yearsActive: 7, serviceAreas: ["Andheri West", "Bandra"], categories: ["Air Conditioning", "Appliance Repair"] },
    { businessName: "Delhi Shifting Solutions", providerType: "company", tagline: "Packers & movers who actually pack properly", description: "Local shifting within Delhi NCR with trained packing teams, GPS-tracked tempos and transit insurance.", community: "Hauz Khas", verificationStatus: "verified", priceIndicator: "From ₹4,500/move", yearsActive: 10, serviceAreas: ["Hauz Khas"], categories: ["Household Moving", "Furniture Transport"] },
    { businessName: "Gachibowli Tuitions", providerType: "individual", tagline: "CBSE maths made simple", description: "Home tuitions for Classes 6-12, CBSE and State board. Weekly progress reports to parents. First class free.", community: "Gachibowli", verificationStatus: "not_verified", priceIndicator: "₹600/hour", yearsActive: 4, serviceAreas: ["Gachibowli"], categories: ["Tutor"] },
    { businessName: "Priya's Beauty At Home", providerType: "individual", tagline: "Salon-quality facials and mehendi at home", description: "Bridal packages, facials, waxing, threading and mehendi at your doorstep. Products sealed and opened in front of you.", community: "Whitefield", verificationStatus: "pending", priceIndicator: "From ₹799", yearsActive: 5, serviceAreas: ["Whitefield"], categories: ["Beauty Services", "Hairdresser"] },
    { businessName: "Pestokill Bengaluru", providerType: "company", tagline: "Cockroach-free kitchens, guaranteed 90 days", description: "Herbal and gel-based pest control for cockroaches, ants, termites and bedbugs. Odourless treatments safe for kids and pets.", community: "Koramangala", verificationStatus: "verified", priceIndicator: "From ₹899", yearsActive: 8, serviceAreas: ["Koramangala", "Indiranagar", "Whitefield"], categories: ["Pest Control"] },
    { businessName: "Mumbai Tiffin & Catering Co.", providerType: "small_business", tagline: "Ghar ka khana for offices and events", description: "Daily tiffin service and event catering. Veg and Jain menus a specialty. Hygiene-certified kitchen in Andheri.", community: "Andheri West", verificationStatus: "verified", priceIndicator: "₹120/tiffin", yearsActive: 12, serviceAreas: ["Andheri West", "Bandra"], categories: ["Catering"] },
    { businessName: "Hauz Khas Pet Care", providerType: "individual", tagline: "Walks, boarding and belly rubs", description: "Experienced pet sitter and dog walker. Daily walk packages, festival boarding and daily photo updates.", community: "Hauz Khas", verificationStatus: "not_verified", priceIndicator: "₹350/walk", yearsActive: 3, serviceAreas: ["Hauz Khas"], categories: ["Pet Sitter"] },
    { businessName: "Hyderabad Watt Works", providerType: "sole_trader", tagline: "Fix today, invoice tomorrow", description: "Electrician for flats and villas in Gachibowli. Inverters, wiring faults, appliance points and society maintenance contracts.", community: "Gachibowli", verificationStatus: "verified", priceIndicator: "₹300/visit", yearsActive: 11, serviceAreas: ["Gachibowli"], categories: ["Electrical", "Handyman"] },
  ];

  const providers = await db
    .insert(providersTable)
    .values(
      providerDefs.map((p) => ({
        businessName: p.businessName,
        providerType: p.providerType,
        tagline: p.tagline,
        description: p.description,
        communityId: com(p.community).id,
        verificationStatus: p.verificationStatus,
        priceIndicator: p.priceIndicator ?? null,
        yearsActive: p.yearsActive ?? null,
        serviceAreas: p.serviceAreas,
      })),
    )
    .returning();
  const prov = (name: string) => providers.find((p) => p.businessName === name)!;

  await db.insert(providerCategoriesTable).values(
    providerDefs.flatMap((p) =>
      p.categories
        .filter((c) => cats.some((k) => k.name === c))
        .map((c) => ({ providerId: prov(p.businessName).id, categoryId: cat(c).id })),
    ),
  );

  // ---------------- Reviews ----------------
  const reviewerPools: Record<string, string[]> = {
    ZA: ["Nomsa D.", "Pieter v.d. Merwe", "Ayesha K.", "Sibusiso M.", "Karen W.", "Tumi L.", "Riaan B.", "Precious N.", "Deshan P.", "Annelize S."],
    US: ["Mike R.", "Sarah T.", "Jessica L.", "Dave K.", "Emily C.", "Carlos M.", "Rachel G.", "Tom H.", "Brittany S.", "Andre W."],
    IN: ["Rohan S.", "Priya M.", "Anil Kumar", "Sneha R.", "Vikram J.", "Deepa N.", "Arjun P.", "Kavitha B.", "Rahul T.", "Meera I."],
  };
  const comments = {
    great: [
      "Arrived on time, quoted upfront and the work was spotless. Highly recommend to anyone in the area.",
      "Second time using them and just as good as the first. Professional from start to finish.",
      "Explained exactly what was wrong, fixed it the same day and charged what was quoted. Rare these days!",
      "Went above and beyond — even fixed a small extra issue at no charge. Will definitely use again.",
      "Friendly, tidy and fast. My neighbours have already booked them after seeing the result.",
      "Outstanding workmanship. You can tell they take pride in what they do.",
    ],
    good: [
      "Good work overall. Arrived a bit later than promised but communicated well and the quality was solid.",
      "Job done properly and the price was fair. Would use again.",
      "Happy with the result. Took slightly longer than expected but no complaints about the quality.",
      "Reliable and honest. Not the cheapest quote I got, but worth it for the peace of mind.",
    ],
    average: [
      "Work was okay but I had to call them back once to redo a section. They did come back promptly to be fair.",
      "Average experience. Got the job done but communication could have been better.",
    ],
  };
  const providerResponses = [
    "Thank you for the kind words! It was a pleasure working at your home.",
    "Thanks for the feedback — we appreciate your support and the referrals!",
    "Apologies again for the delay that day; glad we could make it right. Thank you for the honest review.",
    null, null, null,
  ];

  const countryOfProvider = (p: (typeof providers)[number]): string => {
    const cm = communities.find((c) => c.id === p.communityId)!;
    const ct = cities.find((c) => c.id === cm.cityId)!;
    return [za, us, ind].find((k) => k!.id === ct.countryId)!.code;
  };

  // deterministic pseudo-random
  let seedN = 42;
  const rand = () => {
    seedN = (seedN * 1103515245 + 12345) % 2147483648;
    return seedN / 2147483648;
  };
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]!;

  const reviewRows: (typeof reviewsTable.$inferInsert)[] = [];
  for (const p of providers) {
    const isVerified = p.verificationStatus === "verified";
    const n = isVerified ? 3 + Math.floor(rand() * 8) : Math.floor(rand() * 4);
    const quality = isVerified ? 4 + (rand() > 0.4 ? 1 : 0) : 3 + Math.floor(rand() * 2);
    for (let i = 0; i < n; i++) {
      const jitter = () => Math.max(2, Math.min(5, quality + (rand() > 0.7 ? -1 : 0)));
      const q = jitter();
      const bucket = q >= 5 ? "great" : q >= 4 ? "good" : "average";
      reviewRows.push({
        providerId: p.id,
        reviewerName: pick(reviewerPools[countryOfProvider(p)]!),
        comment: pick(comments[bucket as keyof typeof comments]),
        verifiedJob: rand() > 0.35,
        quality: q,
        price: jitter(),
        reliability: jitter(),
        professionalism: jitter(),
        overall: q,
        providerResponse: rand() > 0.75 ? pick(providerResponses.filter(Boolean) as string[]) : null,
        createdAt: daysAgo(Math.floor(rand() * 400) + 2),
      });
    }
  }
  await db.insert(reviewsTable).values(reviewRows);

  // ---------------- Jobs ----------------
  type J = {
    title: string; description: string; category: string; community: string;
    budgetType: string; budgetMin?: number; budgetMax?: number; urgency: string;
    preferredDate?: string; status?: string; daysOld: number;
  };
  const jobDefs: J[] = [
    { title: "Need a plumber — kitchen sink leaking", description: "Kitchen sink is leaking underneath the basin. Cupboard is getting water damage. Would prefer someone this Saturday morning.", category: "Plumbing", community: "Sandton", budgetType: "fixed", budgetMin: 600, urgency: "soon", preferredDate: "Saturday", daysOld: 1 },
    { title: "Geyser burst — urgent replacement", description: "Geyser burst in the ceiling this morning. Water has been shut off. Need a replacement 150L geyser installed with a COC as soon as possible.", category: "Plumbing", community: "Randburg", budgetType: "range", budgetMin: 7000, budgetMax: 10000, urgency: "emergency", daysOld: 0 },
    { title: "Install 3 new light fittings and fix tripping plug circuit", description: "Bought three pendant lights for the kitchen that need installing, and the plug circuit in the lounge trips when we use the heater.", category: "Electrical", community: "Fourways", budgetType: "fixed", budgetMin: 800, urgency: "flexible", daysOld: 2 },
    { title: "Weekly garden service needed", description: "Medium garden (about 500sqm) needs weekly mowing, edging and beds weeded. Looking for a reliable regular arrangement.", category: "Gardening", community: "Centurion", budgetType: "range", budgetMin: 400, budgetMax: 600, urgency: "flexible", daysOld: 3 },
    { title: "Deep clean before moving in", description: "Moving into a 3-bedroom house in two weeks. Need a full deep clean: windows, oven, bathrooms, cupboards inside and out.", category: "Deep Cleaning", community: "Umhlanga", budgetType: "open", urgency: "soon", preferredDate: "Next weekend", daysOld: 1 },
    { title: "Repaint two bedrooms", description: "Two standard bedrooms need repainting — walls and ceilings. Paint colour already chosen, will supply the paint if that helps the price.", category: "Painting", community: "Sea Point", budgetType: "range", budgetMin: 3500, budgetMax: 5500, urgency: "flexible", daysOld: 5 },
    { title: "Pool has gone green — rescue needed", description: "Came back from holiday to a green pool. Pump seems to run fine. Need a green-to-clean treatment and advice on weekly maintenance.", category: "Pool Maintenance", community: "Centurion", budgetType: "fixed", budgetMin: 1500, urgency: "urgent", daysOld: 1 },
    { title: "Move a 2-bedroom flat within Joburg", description: "Moving from Randburg to Roodepoort at month end. 2-bedroom flat, no major appliances, ground floor to first floor.", category: "Household Moving", community: "Randburg", budgetType: "range", budgetMin: 2500, budgetMax: 4000, urgency: "soon", preferredDate: "Month end", daysOld: 4 },
    { title: "Matric maths tutor needed — 2x per week", description: "My daughter is in matric and needs help with maths (currently at 52%). Looking for two sessions a week, at our home in Hatfield.", category: "Tutor", community: "Hatfield", budgetType: "range", budgetMin: 250, budgetMax: 350, urgency: "soon", daysOld: 2 },
    { title: "Fix two wooden fence panels", description: "Two wooden fence panels blew over in the storm. Posts look okay, panels need replacing or re-fixing.", category: "Handyman", community: "North Austin", budgetType: "fixed", budgetMin: 250, urgency: "soon", daysOld: 1 },
    { title: "Water heater making banging noises", description: "40-gallon gas water heater is making loud banging sounds. It's about 9 years old. Repair or replace advice welcome.", category: "Plumbing", community: "South Congress", budgetType: "open", urgency: "soon", daysOld: 2 },
    { title: "Install EV charger in garage", description: "Just bought an EV and need a Level 2 charger installed in the garage. Panel is on the opposite wall, about 20 feet away.", category: "Electrical", community: "Downtown Austin", budgetType: "range", budgetMin: 600, budgetMax: 1200, urgency: "flexible", daysOld: 6 },
    { title: "Bi-weekly house cleaning", description: "Looking for a regular bi-weekly clean of a 2-bed 2-bath apartment. Prefer eco-friendly products, we have a cat.", category: "General Cleaning", community: "Oak Lawn", budgetType: "range", budgetMin: 100, budgetMax: 150, urgency: "flexible", daysOld: 3 },
    { title: "Help moving a couch up 4 flights", description: "Bought a sleeper sofa that needs to go from the curb to a 4th floor walk-up in Park Slope. Two strong people, maybe 30 minutes of work.", category: "Furniture Transport", community: "Park Slope", budgetType: "fixed", budgetMin: 150, urgency: "urgent", preferredDate: "This week", daysOld: 0 },
    { title: "Dryer not heating", description: "Electric dryer runs but doesn't heat. It's a Whirlpool, about 6 years old. Available weekday evenings.", category: "Appliance Repair", community: "Astoria", budgetType: "open", urgency: "soon", daysOld: 1 },
    { title: "Front yard landscaping refresh", description: "Front beds are overgrown. Want them cleared, mulched and planted with low-maintenance natives before a family event next month.", category: "Landscaping", community: "Midtown Atlanta", budgetType: "range", budgetMin: 400, budgetMax: 800, urgency: "soon", daysOld: 4 },
    { title: "Family photoshoot — golden hour", description: "Looking for a photographer for a relaxed outdoor family shoot (5 people, one toddler). Weekend evening preferred.", category: "Photographer", community: "South Congress", budgetType: "range", budgetMin: 300, budgetMax: 500, urgency: "flexible", daysOld: 7 },
    { title: "Need an electrician — two power sockets dead", description: "Two power sockets in the bedroom have stopped working. Rest of the flat is fine. Suspect a loose connection somewhere.", category: "Electrical", community: "Whitefield", budgetType: "fixed", budgetMin: 1500, urgency: "soon", daysOld: 1 },
    { title: "Full home deep clean — 3BHK", description: "3BHK flat needs a full deep clean including sofa shampooing and balcony. Flexible on dates, quality matters most.", category: "Deep Cleaning", community: "Koramangala", budgetType: "range", budgetMin: 4000, budgetMax: 6000, urgency: "flexible", daysOld: 2 },
    { title: "Wardrobe hinge repairs + new study shelf", description: "Three wardrobe doors have broken hinges and I want a wall-mounted study shelf installed. Materials can be discussed.", category: "Carpentry", community: "Bandra", budgetType: "open", urgency: "flexible", daysOld: 3 },
    { title: "2 split ACs need servicing before summer", description: "Two 1.5-ton split ACs haven't been serviced in over a year. One has weak cooling — may need a gas top-up.", category: "Air Conditioning", community: "Andheri West", budgetType: "range", budgetMin: 1000, budgetMax: 2000, urgency: "soon", daysOld: 1 },
    { title: "Shifting 1BHK from Hauz Khas to Saket", description: "Local shift of a 1BHK — bed, fridge, washing machine, 15 boxes. Building has a lift on both ends.", category: "Household Moving", community: "Hauz Khas", budgetType: "fixed", budgetMin: 5000, urgency: "soon", preferredDate: "This Sunday", daysOld: 2 },
    { title: "Cockroach treatment for kitchen", description: "Seeing cockroaches in the kitchen at night. Need safe, odourless gel treatment — we have a toddler at home.", category: "Pest Control", community: "Indiranagar", budgetType: "fixed", budgetMin: 900, urgency: "urgent", daysOld: 0 },
    { title: "Birthday party catering — 40 guests", description: "Catering needed for a 40-guest birthday at home: mixed veg and non-veg menu, starters plus mains and dessert.", category: "Catering", community: "Bandra", budgetType: "range", budgetMin: 15000, budgetMax: 25000, urgency: "soon", preferredDate: "In three weeks", daysOld: 5 },
    // Completed examples
    { title: "Fix leaking bathroom tap", description: "Bathroom mixer tap dripping constantly. Replaced cartridge needed.", category: "Plumbing", community: "Randburg", budgetType: "fixed", budgetMin: 450, urgency: "soon", status: "completed", daysOld: 30 },
    { title: "Mount 3 TVs and hide cables", description: "Three TVs mounted with concealed cabling in a new apartment.", category: "Handyman", community: "Downtown Austin", budgetType: "fixed", budgetMin: 300, urgency: "flexible", status: "completed", daysOld: 45 },
    { title: "AC installation in new bedroom", description: "New 1-ton split AC purchased, needed installation with copper piping.", category: "Air Conditioning", community: "Whitefield", budgetType: "fixed", budgetMin: 2500, urgency: "soon", status: "completed", daysOld: 21 },
  ];

  const jobs = await db
    .insert(jobsTable)
    .values(
      jobDefs.map((j) => ({
        title: j.title,
        description: j.description,
        categoryId: cat(j.category).id,
        communityId: com(j.community).id,
        budgetType: j.budgetType,
        budgetMin: j.budgetMin ?? null,
        budgetMax: j.budgetType === "fixed" ? j.budgetMin ?? null : j.budgetMax ?? null,
        urgency: j.urgency,
        preferredDate: j.preferredDate ?? null,
        status: j.status ?? "open",
        isMine: false,
        createdAt: daysAgo(j.daysOld),
      })),
    )
    .returning();
  const job = (title: string) => jobs.find((j) => j.title === title)!;

  // ---------------- Expressions of interest ----------------
  type I = { job: string; provider: string; message: string; canMeetBudget: boolean; estimateMin?: number; estimateMax?: number; availability?: string };
  const interestDefs: I[] = [
    { job: "Need a plumber — kitchen sink leaking", provider: "Thabo Plumbing Services", message: "I can assist Saturday morning and the R600 budget should be sufficient assuming no replacement pipes are required.", canMeetBudget: true, availability: "Saturday 8am-12pm" },
    { job: "Need a plumber — kitchen sink leaking", provider: "QuickFix Plumbing", message: "Interested — based on the description it could be the trap or the seal. Estimate R550-R700 depending on parts. Can inspect Friday.", canMeetBudget: true, estimateMin: 550, estimateMax: 700, availability: "Friday afternoon or Saturday" },
    { job: "Need a plumber — kitchen sink leaking", provider: "Joe Handyman", message: "Happy to take a look — I fix these regularly and R600 works for me if it's the standard under-sink fitting.", canMeetBudget: true, availability: "Saturday or Sunday" },
    { job: "Geyser burst — urgent replacement", provider: "QuickFix Plumbing", message: "We can be there today with a 150L Kwikot including COC. Realistic total is R8,500-R9,800 including the ceiling access work.", canMeetBudget: true, estimateMin: 8500, estimateMax: 9800, availability: "Today" },
    { job: "Geyser burst — urgent replacement", provider: "Thabo Plumbing Services", message: "Interested, but I'd need to inspect first — if the drip tray and valves also need replacing it may go slightly over your range.", canMeetBudget: false, estimateMin: 9500, estimateMax: 11500, availability: "Tomorrow morning" },
    { job: "Install 3 new light fittings and fix tripping plug circuit", provider: "Mokoena Electrical", message: "Pendants plus fault finding on the tripping circuit fits your R800 if it's a single fault. COC-registered electrician.", canMeetBudget: true, availability: "Wednesday" },
    { job: "Weekly garden service needed", provider: "Green Thumb Gardens", message: "We have a Tuesday route in Centurion with a slot open. R500/visit including green waste removal.", canMeetBudget: true, estimateMin: 500, estimateMax: 500, availability: "Tuesdays" },
    { job: "Pool has gone green — rescue needed", provider: "Pretoria Pool Care", message: "Green-to-clean is my specialty — R1,500 covers chemicals and three visits over a week to get it sparkling.", canMeetBudget: true, availability: "Can start tomorrow" },
    { job: "Move a 2-bedroom flat within Joburg", provider: "Jozi Movers", message: "Month-end is busy but we have Saturday morning open. R3,200 flat rate including blankets and two crew.", canMeetBudget: true, estimateMin: 3200, estimateMax: 3200, availability: "Month-end Saturday AM" },
    { job: "Matric maths tutor needed — 2x per week", provider: "Hatfield Tutors", message: "We have a matric specialist available Mondays and Thursdays. R300/hour with a written progress report every two weeks.", canMeetBudget: true, estimateMin: 300, estimateMax: 300, availability: "Mon & Thu evenings" },
    { job: "Fix two wooden fence panels", provider: "ATX Handyman Co.", message: "If the posts are solid, $250 covers labor and standard pickets. Can swing by Thursday for a look.", canMeetBudget: true, availability: "Thursday" },
    { job: "Water heater making banging noises", provider: "Hill Country Plumbing", message: "Banging usually means sediment buildup. At 9 years, a flush might buy time but replacement is likely — happy to quote both options after a look.", canMeetBudget: true, availability: "This week" },
    { job: "Install EV charger in garage", provider: "Lone Star Electric", message: "We install these weekly. 20-foot run puts you around $850-$1,050 including permit. Panel photo would firm that up.", canMeetBudget: true, estimateMin: 850, estimateMax: 1050, availability: "Next week" },
    { job: "Help moving a couch up 4 flights", provider: "Brooklyn Stoop Movers", message: "Walk-ups are literally our specialty. $150 works for a two-man crew — send the sofa dimensions to confirm it fits the stairwell.", canMeetBudget: true, availability: "Tomorrow evening" },
    { job: "Dryer not heating", provider: "Astoria Appliance Repair", message: "90% chance it's the heating element or thermal fuse — I carry both for Whirlpool. Typically $140-$180 all-in.", canMeetBudget: true, estimateMin: 140, estimateMax: 180, availability: "Weekday evenings" },
    { job: "Need an electrician — two power sockets dead", provider: "Bright Spark Electricals", message: "Sounds like a loose neutral on that loop. ₹1,500 is fine unless wiring needs replacement — will confirm on inspection.", canMeetBudget: true, availability: "Tomorrow 10am-1pm" },
    { job: "Need an electrician — two power sockets dead", provider: "Hyderabad Watt Works", message: "Interested if you can share photos of the switchboard. Estimate ₹1,200-₹1,800 depending on the fault.", canMeetBudget: true, estimateMin: 1200, estimateMax: 1800, availability: "This week" },
    { job: "Full home deep clean — 3BHK", provider: "UrbanNest Deep Clean", message: "3BHK with sofa shampooing and balcony comes to ₹5,499 with our 8-person crew, done in one day.", canMeetBudget: true, estimateMin: 5499, estimateMax: 5499, availability: "Any day next week" },
    { job: "Wardrobe hinge repairs + new study shelf", provider: "Bandra Carpenter Bros", message: "Hinge replacements plus a good plywood shelf with brackets — roughly ₹2,000-₹3,000 with materials. Can visit Sunday.", canMeetBudget: true, estimateMin: 2000, estimateMax: 3000, availability: "Sunday" },
    { job: "2 split ACs need servicing before summer", provider: "CoolBreeze AC Services", message: "Two services at ₹499 each; if the weak unit needs gas it's ₹2,200 extra for R32. Total stays near your range unless gas is needed.", canMeetBudget: true, estimateMin: 998, estimateMax: 3200, availability: "Tomorrow" },
    { job: "Shifting 1BHK from Hauz Khas to Saket", provider: "Delhi Shifting Solutions", message: "₹5,000 works for a lift-to-lift 1BHK with 15 boxes. Includes packing material and transit insurance.", canMeetBudget: true, availability: "Sunday morning" },
    { job: "Cockroach treatment for kitchen", provider: "Pestokill Bengaluru", message: "Our herbal gel treatment is safe for toddlers, no need to vacate. ₹899 with a 90-day guarantee.", canMeetBudget: true, availability: "Today or tomorrow" },
  ];
  await db.insert(jobInterestsTable).values(
    interestDefs.map((i) => ({
      jobId: job(i.job).id,
      providerId: prov(i.provider).id,
      message: i.message,
      canMeetBudget: i.canMeetBudget,
      estimateMin: i.estimateMin ?? null,
      estimateMax: i.estimateMax ?? null,
      availability: i.availability ?? null,
    })),
  );

  // Mark jobs with interest as providers_interested
  const interestedJobTitles = [...new Set(interestDefs.map((i) => i.job))];
  for (const t of interestedJobTitles) {
    const j = job(t);
    if (j.status === "open") {
      await db
        .update(jobsTable)
        .set({ status: "providers_interested" })
        .where(eq(jobsTable.id, j.id));
    }
  }

  // ---------------- Advertisements ----------------
  await db.insert(adsTable).values([
    { businessName: "Fourways Farmers Market", title: "Sunday Market — Every Week", description: "Local produce, craft food and live music every Sunday from 9am. Family and pet friendly.", countryId: za!.id, targetArea: "Fourways, Johannesburg", imageUrl: "https://placehold.co/600x300/1a4d2e/ffffff?text=Fourways+Farmers+Market", linkUrl: null },
    { businessName: "Sandton Driving Academy", title: "K53 Lessons — First Lesson Free", description: "Patient instructors, dual-control cars and a 92% first-time pass rate. Book your free intro lesson.", countryId: za!.id, targetArea: "Sandton & Randburg", imageUrl: "https://placehold.co/600x300/14342b/ffffff?text=Sandton+Driving+Academy", linkUrl: null },
    { businessName: "Centurion Christmas Lights Festival", title: "Community Lights Festival", description: "The annual neighbourhood lights walk returns this December. Food stalls, choir and free entry.", countryId: za!.id, targetArea: "Centurion, Pretoria", imageUrl: "https://placehold.co/600x300/2d1b4d/ffffff?text=Lights+Festival", linkUrl: null },
    { businessName: "Austin Community College", title: "Evening Trade Courses", description: "Electrical, plumbing and HVAC certification courses starting this fall. Financial aid available.", countryId: us!.id, targetArea: "Austin, Texas", imageUrl: "https://placehold.co/600x300/1e3a5f/ffffff?text=ACC+Trade+Courses", linkUrl: null },
    { businessName: "Park Slope Food Co-op", title: "New Members Welcome", description: "Member-owned grocery with the best produce prices in Brooklyn. Join at our next orientation.", countryId: us!.id, targetArea: "Park Slope, Brooklyn", imageUrl: "https://placehold.co/600x300/3d2b1f/ffffff?text=Park+Slope+Co-op", linkUrl: null },
    { businessName: "Whitefield Weekend Bazaar", title: "Handmade & Homegrown Market", description: "Local artisans, organic produce and street food every Saturday at the community grounds.", countryId: ind!.id, targetArea: "Whitefield, Bengaluru", imageUrl: "https://placehold.co/600x300/4d1a1a/ffffff?text=Whitefield+Bazaar", linkUrl: null },
    { businessName: "Koramangala Music School", title: "Guitar & Piano Classes for Kids", description: "Trinity-certified teachers, small batches, annual student concert. Free demo class this month.", countryId: ind!.id, targetArea: "Koramangala, Bengaluru", imageUrl: "https://placehold.co/600x300/1a2e4d/ffffff?text=Music+School", linkUrl: null },
  ]);

  console.log("Seeded:", {
    countries: 3,
    cities: cities.length,
    communities: communities.length,
    categories: cats.length,
    providers: providers.length,
    reviews: reviewRows.length,
    jobs: jobs.length,
    interests: interestDefs.length,
  });
}

main()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    pool.end();
    process.exit(1);
  });
