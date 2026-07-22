const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const Admin = require('../models/Admin');
const Page = require('../models/Page');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Skip seeding if data already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('Seed data already exists. Skipping...');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Clear existing data (in case of partial seed)
    await Admin.deleteMany({});
    await Page.deleteMany({});
    console.log('Cleared existing data.');

    // Create admin user
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123',
      role: 'superadmin',
    });
    console.log('Admin user created:', admin.email);

    // Create sample pages
    const pages = [
      {
        title: 'Electric Vehicles (EV)',
        slug: 'ev',
        description: 'A comprehensive guide to electric vehicles, their technology, and environmental impact.',
        status: 'published',
        publishedAt: new Date(),
        createdBy: admin._id,
        blocks: [
          {
            type: 'header',
            order: 0,
            data: { text: 'Electric Vehicles: The Future of Transportation', level: 1 },
          },
          {
            type: 'paragraph',
            order: 1,
            data: {
              text: 'Electric vehicles (EVs) are automobiles that are propelled by one or more electric motors, using energy stored in rechargeable batteries. The shift toward EVs is accelerating as governments worldwide implement stricter emissions regulations and battery technology continues to advance.',
            },
          },
          {
            type: 'header',
            order: 2,
            data: { text: 'Key Performance Equations', level: 2 },
          },
          {
            type: 'equation',
            order: 3,
            data: {
              equation: 'P = IV = \\frac{V^2}{R} = I^2R',
              displayMode: true,
              description: 'Electric power equation — relates power (P), current (I), voltage (V), and resistance (R)',
            },
          },
          {
            type: 'equation',
            order: 4,
            data: {
              equation: 'E = \\frac{1}{2}CV^2',
              displayMode: true,
              description: 'Energy stored in a capacitor — relevant to supercapacitor energy storage in EVs',
            },
          },
          {
            type: 'equation',
            order: 5,
            data: {
              equation: '\\eta = \\frac{P_{out}}{P_{in}} \\times 100\\%',
              displayMode: true,
              description: 'Motor efficiency — ratio of output mechanical power to input electrical power',
            },
          },
          {
            type: 'header',
            order: 6,
            data: { text: 'EV Battery Comparison', level: 2 },
          },
          {
            type: 'table',
            order: 7,
            data: {
              withHeadings: true,
              content: [
                ['Battery Type', 'Energy Density (Wh/kg)', 'Cycle Life', 'Cost ($/kWh)', 'Application'],
                ['Lithium-Ion (NMC)', '150–220', '500–1500', '$120–150', 'Passenger EVs'],
                ['Lithium Iron Phosphate (LFP)', '90–160', '2000–4000', '$80–110', 'Commercial EVs'],
                ['Solid-State', '300–500', '3000+', '$400+', 'Next-gen EVs'],
                ['Nickel-Metal Hydride', '60–120', '300–600', '$200–300', 'Hybrid vehicles'],
              ],
            },
          },
          {
            type: 'header',
            order: 8,
            data: { text: 'Charging Standards', level: 2 },
          },
          {
            type: 'list',
            order: 9,
            data: {
              style: 'unordered',
              items: [
                'Level 1 (AC): 120V, 1.4–1.9 kW, adds 5–8 km/hour',
                'Level 2 (AC): 240V, 3.3–22 kW, adds 15–90 km/hour',
                'DC Fast Charging: 50–350 kW, adds 100–300+ km in 30 minutes',
                'Ultra-fast (>350 kW): Emerging standard for commercial vehicles',
              ],
            },
          },
          {
            type: 'header',
            order: 10,
            data: { text: 'Range Calculation', level: 2 },
          },
          {
            type: 'equation',
            order: 11,
            data: {
              equation: 'R = \\frac{E_{battery} \\times \\eta_{drivetrain}}{E_{consumption}}',
              displayMode: true,
              description: 'EV range formula — battery energy × drivetrain efficiency ÷ energy consumption per km',
            },
          },
          {
            type: 'paragraph',
            order: 12,
            data: {
              text: 'Where <b>E_battery</b> is the usable battery capacity in kWh, <b>η_drivetrain</b> is the combined drivetrain efficiency (typically 85–92%), and <b>E_consumption</b> is the energy consumption in kWh/km (typically 0.15–0.25 kWh/km for passenger vehicles).',
            },
          },
        ],
      },
      {
        title: 'Renewable Energy Sources',
        slug: 'renewable-energy',
        description: 'An overview of renewable energy technologies including solar, wind, and hydroelectric power.',
        status: 'published',
        publishedAt: new Date(),
        createdBy: admin._id,
        blocks: [
          {
            type: 'header',
            order: 0,
            data: { text: 'Renewable Energy: Powering a Sustainable Future', level: 1 },
          },
          {
            type: 'paragraph',
            order: 1,
            data: {
              text: 'Renewable energy comes from naturally replenishing sources — sunlight, wind, rain, tides, waves, and geothermal heat. Unlike fossil fuels, these sources are virtually inexhaustible on human timescales and produce minimal greenhouse gas emissions during operation.',
            },
          },
          {
            type: 'header',
            order: 2,
            data: { text: 'Solar Photovoltaic Equations', level: 2 },
          },
          {
            type: 'equation',
            order: 3,
            data: {
              equation: 'P_{solar} = G \\cdot A \\cdot \\eta_{panel}',
              displayMode: true,
              description: 'Solar panel power output — irradiance (G, W/m²) × panel area (A, m²) × efficiency (η)',
            },
          },
          {
            type: 'equation',
            order: 4,
            data: {
              equation: 'E_{annual} = P_{peak} \\times H_{peak} \\times PR',
              displayMode: true,
              description: 'Annual energy yield — peak power × peak sun hours per day × 365 × performance ratio',
            },
          },
          {
            type: 'header',
            order: 5,
            data: { text: 'Wind Power Equation', level: 2 },
          },
          {
            type: 'equation',
            order: 6,
            data: {
              equation: 'P_{wind} = \\frac{1}{2} \\rho A v^3 C_p',
              displayMode: true,
              description: 'Wind turbine power — air density (ρ) × swept area (A) × wind speed cubed (v³) × power coefficient (Cp ≤ 0.593)',
            },
          },
          {
            type: 'header',
            order: 7,
            data: { text: 'Energy Source Comparison', level: 2 },
          },
          {
            type: 'table',
            order: 8,
            data: {
              withHeadings: true,
              content: [
                ['Energy Source', 'Capacity Factor', 'LCOE ($/MWh)', 'Land Use (km²/TWh/yr)', 'CO₂ (gCO₂/kWh)'],
                ['Solar PV (utility)', '15–25%', '$30–60', '5–10', '20–50'],
                ['Wind (onshore)', '25–45%', '$25–50', '70–150', '7–15'],
                ['Wind (offshore)', '35–55%', '$60–100', '50–100', '10–20'],
                ['Hydroelectric', '35–60%', '$30–80', '250–750', '4–30'],
                ['Geothermal', '80–95%', '$40–100', '1–10', '15–55'],
                ['Nuclear', '85–95%', '$60–120', '0.3–0.5', '5–15'],
                ['Coal (reference)', '60–80%', '$65–150', '2–5', '820–1050'],
              ],
            },
          },
          {
            type: 'header',
            order: 9,
            data: { text: 'Global Renewable Energy Targets', level: 2 },
          },
          {
            type: 'nested-list',
            order: 10,
            data: {
              style: 'unordered',
              items: [
                {
                  content: 'Solar Energy',
                  items: [
                    { content: 'Global installed capacity: >1.6 TW (2023)', items: [] },
                    { content: 'Target: 11 TW by 2050 (IEA Net Zero)', items: [] },
                    { content: 'Fastest growing energy source globally', items: [] },
                  ],
                },
                {
                  content: 'Wind Energy',
                  items: [
                    { content: 'Global installed capacity: >950 GW (2023)', items: [] },
                    { content: 'Offshore wind: 65 GW installed, 2000+ GW pipeline', items: [] },
                    { content: 'Largest turbines: 15–22 MW offshore', items: [] },
                  ],
                },
                {
                  content: 'Hydroelectric Power',
                  items: [
                    { content: 'Oldest renewable technology in widespread use', items: [] },
                    { content: 'Provides ~16% of global electricity', items: [] },
                    { content: 'Pumped hydro: largest form of grid-scale energy storage', items: [] },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        title: 'Methanol Economy',
        slug: 'methanol',
        description: 'The methanol economy as an alternative fuel and chemical feedstock for sustainable energy storage.',
        status: 'published',
        publishedAt: new Date(),
        createdBy: admin._id,
        blocks: [
          {
            type: 'header',
            order: 0,
            data: { text: 'The Methanol Economy: A Bridge to Sustainable Energy', level: 1 },
          },
          {
            type: 'paragraph',
            order: 1,
            data: {
              text: 'The methanol economy, proposed by Nobel laureate George Olah, envisions methanol (CH₃OH) as a key energy carrier, fuel, and chemical feedstock. Methanol can be produced from CO₂ captured from the atmosphere or industrial sources, combined with renewable hydrogen — creating a carbon-neutral fuel cycle.',
            },
          },
          {
            type: 'header',
            order: 2,
            data: { text: 'Chemical Reactions', level: 2 },
          },
          {
            type: 'equation',
            order: 3,
            data: {
              equation: 'CO_2 + 3H_2 \\rightarrow CH_3OH + H_2O',
              displayMode: true,
              description: 'Methanol synthesis from CO₂ and green hydrogen (Sabatier process variant)',
            },
          },
          {
            type: 'equation',
            order: 4,
            data: {
              equation: '2CH_3OH + 3O_2 \\rightarrow 2CO_2 + 4H_2O \\quad \\Delta H = -726.5 \\text{ kJ/mol}',
              displayMode: true,
              description: 'Complete combustion of methanol — releases 726.5 kJ per mole',
            },
          },
          {
            type: 'equation',
            order: 5,
            data: {
              equation: 'CH_3OH \\rightarrow CO + 2H_2 \\quad \\text{(Steam Reforming)}',
              displayMode: true,
              description: 'Methanol steam reforming to produce hydrogen — used in fuel cells',
            },
          },
          {
            type: 'header',
            order: 6,
            data: { text: 'Physical and Chemical Properties', level: 2 },
          },
          {
            type: 'table',
            order: 7,
            data: {
              withHeadings: true,
              content: [
                ['Property', 'Methanol', 'Ethanol', 'Gasoline', 'Hydrogen'],
                ['Molecular Formula', 'CH₃OH', 'C₂H₅OH', 'C₈H₁₈ (approx)', 'H₂'],
                ['Energy Density (MJ/L)', '15.6', '21.2', '34.2', '8.5 (liquid)'],
                ['Boiling Point (°C)', '64.7', '78.4', '~40–200', '-252.8'],
                ['Flash Point (°C)', '11', '13', '-43', '-253'],
                ['Octane Rating (RON)', '109', '108', '91–98', '130+'],
                ['CO₂ Emissions (g/MJ)', '68.4 (fossil)', '0–17 (bio)', '73.3', '0 (green)'],
              ],
            },
          },
          {
            type: 'header',
            order: 8,
            data: { text: 'Production Pathways', level: 2 },
          },
          {
            type: 'list',
            order: 9,
            data: {
              style: 'ordered',
              items: [
                'Green Methanol: CO₂ + renewable H₂ → CH₃OH (carbon-neutral)',
                'Blue Methanol: natural gas reforming + CCS → CH₃OH (low-carbon)',
                'Bio-Methanol: biomass gasification → syngas → CH₃OH',
                'Grey Methanol: fossil natural gas without CCS (current dominant method)',
              ],
            },
          },
          {
            type: 'equation',
            order: 10,
            data: {
              equation: '\\eta_{MtP} = \\frac{LHV_{methanol}}{LHV_{H_2} + E_{CO_2 capture}} \\times 100\\%',
              displayMode: true,
              description: 'Methanol-to-Power efficiency — accounts for hydrogen and CO₂ capture energy inputs',
            },
          },
        ],
      },
      {
        title: 'Mohar Optimization Platform',
        slug: 'mohar',
        description: 'Technical documentation for the Mohar energy optimization platform using MILP algorithms.',
        status: 'published',
        publishedAt: new Date(),
        createdBy: admin._id,
        blocks: [
          {
            type: 'header',
            order: 0,
            data: { text: 'Mohar: Energy System Optimization Platform', level: 1 },
          },
          {
            type: 'paragraph',
            order: 1,
            data: {
              text: 'Mohar is an advanced energy optimization platform that uses Mixed Integer Linear Programming (MILP) to minimize operational costs while satisfying energy demand constraints, renewable generation variability, and grid reliability requirements.',
            },
          },
          {
            type: 'header',
            order: 2,
            data: { text: 'Core Optimization Formulation', level: 2 },
          },
          {
            type: 'equation',
            order: 3,
            data: {
              equation: '\\min \\sum_{t=1}^{T} \\sum_{i=1}^{N} \\left( C_i^{var} \\cdot P_{i,t} + C_i^{start} \\cdot u_{i,t} \\right)',
              displayMode: true,
              description: 'Objective function — minimize total variable costs and startup costs across all units and time periods',
            },
          },
          {
            type: 'header',
            order: 4,
            data: { text: 'Constraints', level: 2 },
          },
          {
            type: 'equation',
            order: 5,
            data: {
              equation: '\\sum_{i=1}^{N} P_{i,t} + P_{t}^{ren} \\geq D_t + R_t \\quad \\forall t',
              displayMode: true,
              description: 'Power balance constraint — total generation ≥ demand + spinning reserve at each time step',
            },
          },
          {
            type: 'equation',
            order: 6,
            data: {
              equation: 'P_i^{min} \\cdot x_{i,t} \\leq P_{i,t} \\leq P_i^{max} \\cdot x_{i,t} \\quad \\forall i, t',
              displayMode: true,
              description: 'Generation bounds — power output bounded by min/max capacity when unit is online (x=1)',
            },
          },
          {
            type: 'equation',
            order: 7,
            data: {
              equation: 'SOC_{t+1} = SOC_t + \\eta_c \\cdot P_t^{ch} - \\frac{P_t^{dis}}{\\eta_d}',
              displayMode: true,
              description: 'Battery state-of-charge (SOC) dynamics — charge efficiency ηc, discharge efficiency ηd',
            },
          },
          {
            type: 'header',
            order: 8,
            data: { text: 'MILP Parameter Reference', level: 2 },
          },
          {
            type: 'table',
            order: 9,
            data: {
              withHeadings: true,
              content: [
                ['Parameter', 'Symbol', 'Unit', 'Typical Range', 'Description'],
                ['Variable cost', 'Cᵢᵛᵃʳ', '$/MWh', '15–80', 'Fuel + O&M cost per MWh generated'],
                ['Startup cost', 'Cᵢˢᵗᵃʳᵗ', '$', '1,000–50,000', 'Cost to bring a unit from cold to online'],
                ['Min generation', 'Pᵢᵐⁱⁿ', 'MW', '20–40% of Pmax', 'Minimum stable generation level'],
                ['Max generation', 'Pᵢᵐᵃˣ', 'MW', '100–2000', 'Nameplate capacity'],
                ['Charge efficiency', 'ηc', '%', '90–98', 'Round-trip charge efficiency of storage'],
                ['Discharge efficiency', 'ηd', '%', '90–98', 'Round-trip discharge efficiency'],
                ['Demand', 'Dt', 'MW', 'Variable', 'Forecasted load at time t'],
                ['Reserve', 'Rt', 'MW', '10–15% of Dt', 'Spinning reserve requirement'],
              ],
            },
          },
          {
            type: 'documentation',
            order: 10,
            data: {
              title: 'Mohar API Reference',
              sections: [
                {
                  heading: 'POST /api/optimize',
                  content: 'Submit an optimization job. Accepts a JSON payload with horizon (hours), units array, demand profile, renewable forecast, and storage configuration.',
                },
                {
                  heading: 'GET /api/results/:jobId',
                  content: 'Retrieve optimization results by job ID. Returns dispatch schedule, cost breakdown, renewable curtailment, and constraint violations (if any).',
                },
                {
                  heading: 'GET /api/scenarios',
                  content: 'List all saved optimization scenarios with metadata (created_at, horizon, status, total_cost).',
                },
                {
                  heading: 'POST /api/scenarios/:id/run',
                  content: 'Re-run an existing saved scenario with optional parameter overrides. Useful for sensitivity analysis.',
                },
              ],
            },
          },
          {
            type: 'mixed-content',
            order: 11,
            data: {
              title: 'Solver Performance Summary',
              content: [
                {
                  type: 'paragraph',
                  text: 'Mohar uses the HiGHS open-source MILP solver with warm-starting and branch-and-bound optimization. Typical solve times for a 24-hour unit commitment problem:',
                },
                {
                  type: 'table',
                  withHeadings: true,
                  rows: [
                    ['Problem Size', 'Units', 'Time Steps', 'Solve Time', 'Optimality Gap'],
                    ['Small', '5–10', '24', '<5 seconds', '<0.1%'],
                    ['Medium', '20–50', '96', '30–120 seconds', '<0.5%'],
                    ['Large', '100–200', '168', '5–30 minutes', '<1%'],
                  ],
                },
                {
                  type: 'equation',
                  equation: '\\text{Gap}\\% = \\frac{\\text{Incumbent} - \\text{Lower Bound}}{\\text{Incumbent}} \\times 100',
                  description: 'MIP optimality gap — measures how close the solution is to the global optimum',
                },
              ],
            },
          },
        ],
      },
    ];

    for (const pageData of pages) {
      await Page.create(pageData);
      console.log(`Created page: ${pageData.title}`);
    }

    console.log('\n✅ Seed complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin credentials:');
    console.log('  Email:    admin@gmail.com');
    console.log('  Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Pages seeded: ${pages.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seedData();
