/**
 * SEED SCRIPT — Populates the database with technologies across all sectors.
 * Run: node seed.js
 * Safe to re-run: skips existing technologies by slug.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Technology = require('./src/models/Technology');

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const mkRoadmap = (steps) => steps.map(s => ({
  title: s[0],
  description: s[1],
  duration: s[2] || '2 hours',
  resources: [
    { title: 'Official Documentation', url: `https://google.com/search?q=${encodeURIComponent(s[0])}`, type: 'article' },
    { title: 'Video Tutorial', url: `https://youtube.com/results?search_query=${encodeURIComponent(s[0])}`, type: 'video' },
    { title: 'Practice Challenge', url: `Build a hands-on project applying ${s[0]}`, type: 'quest' },
  ]
}));

// ==============================
// TECHNOLOGIES DATA — 2-3 per sector
// ==============================
const TECHNOLOGIES = [
  // ─── ENGINEERING: cs ───
  { name: 'React.js', sector: 'cs', category: 'Full Stack', difficulty: 'Intermediate',
    description: 'A declarative JavaScript library for building user interfaces with component-based architecture.',
    roadmap: mkRoadmap([
      ['JSX & Components', 'Learn how JSX syntax works and how to create functional and class components. Understand props, children, and component composition patterns.', '3 hours'],
      ['State & Hooks', 'Master useState, useEffect, useContext and custom hooks. Learn state management patterns and side effect handling.', '4 hours'],
      ['Routing & APIs', 'Implement client-side routing with React Router and integrate RESTful APIs using fetch/axios. Handle loading states and errors gracefully.', '3 hours'],
    ])},
  { name: 'Docker', sector: 'cs', category: 'DevOps', difficulty: 'Intermediate',
    description: 'Containerization platform that packages applications and dependencies into portable, isolated environments.',
    roadmap: mkRoadmap([
      ['Container Fundamentals', 'Understand images, containers, and the Docker daemon. Learn to pull, run, stop, and remove containers.', '2 hours'],
      ['Dockerfiles & Builds', 'Write multi-stage Dockerfiles, optimize layer caching, and build production-ready images.', '3 hours'],
      ['Docker Compose & Orchestration', 'Define multi-container apps with docker-compose. Learn networking, volumes, and scaling strategies.', '3 hours'],
    ])},
  { name: 'TensorFlow', sector: 'cs', category: 'AI/ML', difficulty: 'Advanced',
    description: 'Open-source machine learning framework for building and deploying neural networks at scale.',
    roadmap: mkRoadmap([
      ['Tensors & Operations', 'Learn the core data structures of TensorFlow — tensors, shapes, and mathematical operations on GPU.', '3 hours'],
      ['Neural Network Architecture', 'Build sequential and functional models using Keras API. Understand layers, activation functions, and loss optimization.', '4 hours'],
      ['Model Training & Deployment', 'Train models with real datasets, evaluate metrics, and deploy using TensorFlow Serving or TFLite.', '4 hours'],
    ])},

  // ─── ENGINEERING: ee ───
  { name: 'Arduino', sector: 'ee', category: 'Embedded Systems', difficulty: 'Beginner',
    description: 'Open-source microcontroller platform for building interactive electronic projects and prototypes.',
    roadmap: mkRoadmap([
      ['Board Setup & Digital I/O', 'Set up the Arduino IDE, understand pin configurations, and control LEDs and buttons with digital read/write.', '2 hours'],
      ['Analog Sensors & PWM', 'Read analog sensors (temperature, light) and control actuators with pulse-width modulation.', '3 hours'],
      ['Serial Communication & Protocols', 'Communicate between Arduino and computers via Serial. Explore I2C and SPI protocols for sensor modules.', '3 hours'],
    ])},
  { name: 'MQTT Protocol', sector: 'ee', category: 'IoT', difficulty: 'Intermediate',
    description: 'Lightweight messaging protocol designed for constrained devices and low-bandwidth IoT networks.',
    roadmap: mkRoadmap([
      ['Publish-Subscribe Model', 'Understand MQTT topics, QoS levels, and the broker architecture. Set up a Mosquitto broker locally.', '2 hours'],
      ['Client Implementation', 'Build MQTT clients in Python and JavaScript. Handle retained messages, last will, and clean sessions.', '3 hours'],
      ['Security & Scaling', 'Implement TLS encryption, authentication, and ACLs. Design scalable topic hierarchies for production IoT.', '3 hours'],
    ])},

  // ─── ENGINEERING: me ───
  { name: 'SolidWorks', sector: 'me', category: 'Automotive', difficulty: 'Intermediate',
    description: 'Industry-standard 3D CAD software for designing mechanical parts, assemblies, and engineering drawings.',
    roadmap: mkRoadmap([
      ['Sketching & Part Modeling', 'Create 2D sketches with constraints and extrude them into 3D solid parts. Learn fillets, chamfers, and patterns.', '4 hours'],
      ['Assembly Design', 'Build multi-part assemblies with mates and constraints. Simulate motion and detect interferences.', '4 hours'],
      ['Engineering Drawings & FEA', 'Generate production-ready drawings with dimensions and tolerances. Run basic finite element analysis for stress.', '3 hours'],
    ])},
  { name: 'ROS (Robot Operating System)', sector: 'me', category: 'Robotics', difficulty: 'Advanced',
    description: 'Open-source framework providing tools and libraries for building complex robot applications.',
    roadmap: mkRoadmap([
      ['Nodes, Topics & Messages', 'Understand the ROS computation graph. Create publisher/subscriber nodes and define custom message types.', '3 hours'],
      ['Navigation & SLAM', 'Implement simultaneous localization and mapping. Configure the navigation stack for autonomous movement.', '4 hours'],
      ['Simulation with Gazebo', 'Build robot models in URDF/SDF and simulate them in Gazebo. Test algorithms before deploying to hardware.', '4 hours'],
    ])},

  // ─── ENGINEERING: chem_eng ───
  { name: 'ASPEN Plus', sector: 'chem_eng', category: 'Process Control', difficulty: 'Advanced',
    description: 'Chemical process simulation software used for modeling, optimization, and design of industrial plants.',
    roadmap: mkRoadmap([
      ['Flowsheet Basics', 'Set up simple flowsheets with mixers, heaters, and reactors. Define component properties and thermodynamic models.', '3 hours'],
      ['Reactor & Distillation Modeling', 'Model CSTR, PFR, and batch reactors. Design distillation columns with RADFRAC.', '4 hours'],
      ['Process Optimization', 'Use sensitivity analysis and design specs to optimize yield, energy, and cost. Export results for economic analysis.', '3 hours'],
    ])},

  // ─── SCIENCE: physics ───
  { name: 'Quantum Computing', sector: 'physics', category: 'Quantum Computing', difficulty: 'Advanced',
    description: 'Computing paradigm leveraging quantum mechanics principles like superposition and entanglement for exponential speedup.',
    roadmap: mkRoadmap([
      ['Qubits & Superposition', 'Understand classical vs quantum bits, Bloch sphere representation, and measurement collapse.', '3 hours'],
      ['Quantum Gates & Circuits', 'Learn Hadamard, CNOT, and Toffoli gates. Build quantum circuits using Qiskit or Cirq.', '4 hours'],
      ['Quantum Algorithms', 'Implement Grover search and Shor factoring algorithms. Understand quantum advantage and current limitations.', '4 hours'],
    ])},

  // ─── SCIENCE: bio_sci ───
  { name: 'CRISPR Gene Editing', sector: 'bio_sci', category: 'Genetics', difficulty: 'Advanced',
    description: 'Revolutionary genome editing technology enabling precise DNA modifications in living organisms.',
    roadmap: mkRoadmap([
      ['CRISPR-Cas9 Mechanism', 'Understand guide RNA design, PAM sequences, and the Cas9 nuclease mechanism for DNA cleavage.', '3 hours'],
      ['Experimental Design', 'Design sgRNAs, select delivery methods, and plan controls for CRISPR experiments in cell lines.', '4 hours'],
      ['Applications & Ethics', 'Explore gene therapy, agriculture, and diagnostic applications. Discuss ethical frameworks and regulatory landscapes.', '3 hours'],
    ])},
  { name: 'Bioinformatics', sector: 'bio_sci', category: 'Genetics', difficulty: 'Intermediate',
    description: 'Computational analysis of biological data including genomics, proteomics, and phylogenetics.',
    roadmap: mkRoadmap([
      ['Sequence Alignment', 'Learn BLAST, FASTA, and pairwise/multiple sequence alignment algorithms and tools.', '3 hours'],
      ['Genomic Data Analysis', 'Process NGS data, perform variant calling, and annotate genomes using bioinformatics pipelines.', '4 hours'],
      ['Structural Bioinformatics', 'Predict protein structures, analyze molecular docking, and visualize 3D molecular data.', '3 hours'],
    ])},

  // ─── SCIENCE: env_sci ───
  { name: 'Climate Modeling', sector: 'env_sci', category: 'Climate Science', difficulty: 'Advanced',
    description: 'Computational simulation of Earth climate systems to understand and predict climate change impacts.',
    roadmap: mkRoadmap([
      ['Atmospheric Physics', 'Learn radiation balance, greenhouse gas dynamics, and atmospheric circulation patterns.', '3 hours'],
      ['General Circulation Models', 'Understand GCM architecture, parameterization schemes, and model output analysis.', '4 hours'],
      ['Impact Assessment', 'Analyze regional climate projections, sea level rise scenarios, and ecosystem vulnerability.', '3 hours'],
    ])},

  // ─── SCIENCE: math ───
  { name: 'Data Science with Python', sector: 'math', category: 'Data Science', difficulty: 'Intermediate',
    description: 'Statistical analysis, data visualization, and machine learning using Python scientific stack.',
    roadmap: mkRoadmap([
      ['NumPy & Pandas', 'Master array operations, DataFrame manipulation, groupby, and merge operations for data wrangling.', '3 hours'],
      ['Visualization & EDA', 'Create insightful plots with matplotlib and seaborn. Perform exploratory data analysis on real datasets.', '3 hours'],
      ['Scikit-learn ML Pipeline', 'Build classification, regression, and clustering models. Cross-validate, tune hyperparameters, and evaluate.', '4 hours'],
    ])},

  // ─── INFRASTRUCTURE: civil ───
  { name: 'AutoCAD Civil 3D', sector: 'civil', category: 'Structural Eng', difficulty: 'Intermediate',
    description: 'BIM-based civil engineering design software for roads, land development, and infrastructure projects.',
    roadmap: mkRoadmap([
      ['Surface & Terrain Modeling', 'Import survey data, create TIN surfaces, and analyze grading and earthwork volumes.', '3 hours'],
      ['Alignment & Profile Design', 'Design horizontal alignments, vertical profiles, and corridor assemblies for road projects.', '4 hours'],
      ['Pipe Networks & Grading', 'Model storm sewer and utility networks. Create grading groups for site development.', '3 hours'],
    ])},

  // ─── INFRASTRUCTURE: arch ───
  { name: 'Revit Architecture', sector: 'arch', category: 'BIM', difficulty: 'Intermediate',
    description: 'Building Information Modeling software for architects to design, visualize, and document buildings.',
    roadmap: mkRoadmap([
      ['BIM Fundamentals', 'Understand BIM workflow, Revit interface, and project setup with levels, grids, and templates.', '3 hours'],
      ['Building Components', 'Model walls, floors, roofs, stairs, and curtain walls. Create custom families and parametric elements.', '4 hours'],
      ['Documentation & Rendering', 'Generate construction documents, schedules, and sheets. Create photorealistic renders with lighting.', '3 hours'],
    ])},

  // ─── INFRASTRUCTURE: mining ───
  { name: 'Mine Planning Software', sector: 'mining', category: 'Mineralogy', difficulty: 'Advanced',
    description: 'Specialized tools for geological modeling, mine design, and resource estimation in extraction industries.',
    roadmap: mkRoadmap([
      ['Geological Modeling', 'Build 3D block models from drillhole data. Interpret lithology, grade, and structural domains.', '4 hours'],
      ['Open Pit & Underground Design', 'Design pit shells using Lerchs-Grossmann. Plan underground stopes, levels, and ventilation.', '4 hours'],
      ['Production Scheduling', 'Optimize extraction sequences for NPV. Plan fleet, haulage routes, and waste management.', '3 hours'],
    ])},

  // ─── BUSINESS: finance ───
  { name: 'Financial Modeling', sector: 'finance', category: 'Corporate Finance', difficulty: 'Intermediate',
    description: 'Building spreadsheet-based models to forecast financial performance and value companies.',
    roadmap: mkRoadmap([
      ['Three-Statement Model', 'Link income statement, balance sheet, and cash flow. Build dynamic assumptions and drivers.', '4 hours'],
      ['DCF Valuation', 'Calculate free cash flows, WACC, and terminal value. Perform sensitivity analysis on key assumptions.', '3 hours'],
      ['LBO & M&A Modeling', 'Build leveraged buyout models and merger analysis. Evaluate accretion/dilution and synergies.', '4 hours'],
    ])},
  { name: 'Blockchain & DeFi', sector: 'finance', category: 'FinTech', difficulty: 'Advanced',
    description: 'Decentralized financial systems built on blockchain technology — smart contracts, lending protocols, and tokenomics.',
    roadmap: mkRoadmap([
      ['Blockchain Fundamentals', 'Understand distributed ledgers, consensus mechanisms, and cryptographic hashing.', '3 hours'],
      ['Smart Contracts', 'Write and deploy Solidity contracts on Ethereum. Test with Hardhat and interact via ethers.js.', '4 hours'],
      ['DeFi Protocols', 'Explore AMMs, lending protocols, yield farming, and governance tokens. Analyze risks and auditing.', '4 hours'],
    ])},

  // ─── BUSINESS: marketing ───
  { name: 'Google Ads & PPC', sector: 'marketing', category: 'Digital Marketing', difficulty: 'Intermediate',
    description: 'Pay-per-click advertising on Google Search and Display networks for targeted customer acquisition.',
    roadmap: mkRoadmap([
      ['Campaign Structure', 'Set up campaigns, ad groups, and keyword targeting. Understand match types, negative keywords, and bidding.', '3 hours'],
      ['Ad Copy & Landing Pages', 'Write compelling responsive search ads. Design high-converting landing pages with clear CTAs.', '3 hours'],
      ['Analytics & Optimization', 'Track conversions, analyze Quality Score, and optimize ROAS through A/B testing and bid adjustments.', '3 hours'],
    ])},

  // ─── BUSINESS: entrepreneurship ───
  { name: 'Lean Startup Methodology', sector: 'entrepreneurship', category: 'Lean Startup', difficulty: 'Beginner',
    description: 'Build-Measure-Learn framework for validating business ideas quickly with minimal resources.',
    roadmap: mkRoadmap([
      ['Problem-Solution Fit', 'Identify customer pain points through interviews. Define value propositions and minimum viable products.', '2 hours'],
      ['MVP Development & Testing', 'Build concierge/Wizard of Oz MVPs. Design experiments to test core assumptions.', '3 hours'],
      ['Pivot or Persevere', 'Analyze cohort metrics and engine of growth. Decide when to pivot strategy vs doubling down.', '3 hours'],
    ])},

  // ─── BUSINESS: hr ───
  { name: 'People Analytics', sector: 'hr', category: 'Organizational Psych', difficulty: 'Intermediate',
    description: 'Data-driven approach to understanding workforce dynamics, retention, and organizational performance.',
    roadmap: mkRoadmap([
      ['HR Data Collection', 'Structure employee data, survey results, and performance metrics for analytical workflows.', '2 hours'],
      ['Predictive Models', 'Build attrition prediction models and employee engagement scorecards using regression and classification.', '3 hours'],
      ['Dashboards & Storytelling', 'Create executive HR dashboards in Tableau/Power BI. Communicate insights to drive talent strategy.', '3 hours'],
    ])},

  // ─── HEALTH: clinical ───
  { name: 'Clinical Anatomy', sector: 'clinical', category: 'Surgery', difficulty: 'Advanced',
    description: 'Applied study of human anatomy for surgical planning, diagnosis, and clinical decision-making.',
    roadmap: mkRoadmap([
      ['Musculoskeletal System', 'Study bones, joints, muscles, and innervation patterns relevant to orthopedic and trauma surgery.', '4 hours'],
      ['Thorax & Abdomen', 'Map mediastinal structures, peritoneal cavity organs, and retroperitoneal anatomy for surgical access.', '4 hours'],
      ['Neuroanatomy', 'Learn cranial nerves, spinal cord tracts, and brain regions for neurosurgical and neurological assessment.', '4 hours'],
    ])},

  // ─── HEALTH: pharma ───
  { name: 'Drug Discovery Pipeline', sector: 'pharma', category: 'Pharmacology', difficulty: 'Advanced',
    description: 'End-to-end pharmaceutical development from target identification through clinical trials to market approval.',
    roadmap: mkRoadmap([
      ['Target Identification', 'Screen biological targets using genomics and proteomics. Validate druggability through in-silico analysis.', '3 hours'],
      ['Lead Optimization', 'Apply medicinal chemistry and ADMET profiling to optimize hit compounds for potency and safety.', '4 hours'],
      ['Clinical Trials', 'Design Phase I-III trial protocols. Understand regulatory submissions, endpoints, and statistical analysis.', '4 hours'],
    ])},

  // ─── HEALTH: psych ───
  { name: 'Cognitive Behavioral Therapy', sector: 'psych', category: 'Clinical Psych', difficulty: 'Intermediate',
    description: 'Evidence-based psychotherapy approach for treating anxiety, depression, and behavioral disorders.',
    roadmap: mkRoadmap([
      ['CBT Foundations', 'Learn the cognitive model — how thoughts, feelings, and behaviors interact. Identify cognitive distortions.', '3 hours'],
      ['Therapeutic Techniques', 'Master Socratic questioning, behavioral activation, exposure therapy, and thought records.', '4 hours'],
      ['Case Formulation', 'Develop comprehensive case conceptualizations. Plan treatment protocols and measure outcomes.', '3 hours'],
    ])},

  // ─── HEALTH: nursing ───
  { name: 'Critical Care Nursing', sector: 'nursing', category: 'Nursing', difficulty: 'Advanced',
    description: 'Specialized nursing care for critically ill patients in ICU settings with complex monitoring needs.',
    roadmap: mkRoadmap([
      ['Hemodynamic Monitoring', 'Interpret arterial lines, CVP, and pulmonary artery catheter data. Manage vasoactive drips.', '3 hours'],
      ['Mechanical Ventilation', 'Understand ventilator modes, weaning protocols, and ABG interpretation for respiratory management.', '4 hours'],
      ['Multisystem Organ Failure', 'Assess and manage patients with sepsis, DIC, and ARDS. Coordinate multidisciplinary care plans.', '3 hours'],
    ])},

  // ─── LAW: legal ───
  { name: 'Contract Law', sector: 'legal', category: 'Corporate Law', difficulty: 'Intermediate',
    description: 'Legal principles governing binding agreements, obligations, breach remedies, and commercial transactions.',
    roadmap: mkRoadmap([
      ['Formation & Consideration', 'Analyze offer, acceptance, intention, and consideration requirements for valid contract formation.', '3 hours'],
      ['Contract Terms & Interpretation', 'Distinguish express/implied terms, exclusion clauses, and parol evidence rules in contract drafting.', '3 hours'],
      ['Breach & Remedies', 'Evaluate repudiation, fundamental breach, and remedies including damages, specific performance, and rescission.', '3 hours'],
    ])},

  // ─── LAW: politics ───
  { name: 'International Relations', sector: 'politics', category: 'International Relations', difficulty: 'Intermediate',
    description: 'Study of power dynamics, diplomacy, and conflict resolution between nations and global institutions.',
    roadmap: mkRoadmap([
      ['IR Theories', 'Compare realism, liberalism, constructivism, and critical theory frameworks for analyzing global politics.', '3 hours'],
      ['International Organizations', 'Examine the UN, WTO, NATO, and regional bodies. Understand treaty-making and multilateral governance.', '3 hours'],
      ['Conflict & Security', 'Analyze causes of war, deterrence theory, peacekeeping operations, and emerging cyber/hybrid threats.', '3 hours'],
    ])},

  // ─── CREATIVE: design ───
  { name: 'Figma UI/UX Design', sector: 'design', category: 'UI/UX', difficulty: 'Beginner',
    description: 'Collaborative interface design tool for creating wireframes, prototypes, and design systems.',
    roadmap: mkRoadmap([
      ['Frames, Components & Styles', 'Create responsive frames, reusable components, and shared color/text styles for consistent design systems.', '3 hours'],
      ['Prototyping & Animation', 'Build interactive prototypes with smart animate, overlays, and scroll behaviors for user testing.', '3 hours'],
      ['Design Handoff', 'Prepare dev-ready specs with auto-layout, inspect mode, and export assets. Collaborate with developers.', '2 hours'],
    ])},

  // ─── CREATIVE: media ───
  { name: 'Video Production', sector: 'media', category: 'Film Production', difficulty: 'Intermediate',
    description: 'End-to-end video creation from pre-production planning through shooting to post-production editing.',
    roadmap: mkRoadmap([
      ['Pre-Production', 'Write scripts, create storyboards, plan shot lists, and scout locations for efficient production days.', '3 hours'],
      ['Cinematography', 'Master camera settings, composition rules, lighting setups, and movement techniques for visual storytelling.', '4 hours'],
      ['Post-Production', 'Edit in Premiere Pro/DaVinci Resolve. Add color grading, sound design, and motion graphics.', '4 hours'],
    ])},

  // ─── CREATIVE: history ───
  { name: 'Archaeological Methods', sector: 'history', category: 'Archaeology', difficulty: 'Intermediate',
    description: 'Scientific techniques for excavating, dating, and interpreting material evidence of past civilizations.',
    roadmap: mkRoadmap([
      ['Survey & Excavation', 'Learn field survey methods, stratigraphic excavation, and site recording with Harris matrices.', '4 hours'],
      ['Dating Techniques', 'Apply radiocarbon, dendrochronology, thermoluminescence, and relative dating methods to artifacts.', '3 hours'],
      ['Artifact Analysis', 'Classify ceramics, lithics, and faunal remains. Interpret spatial patterns and cultural contexts.', '3 hours'],
    ])},

  // ─── AGRICULTURE: farming ───
  { name: 'Precision Agriculture', sector: 'farming', category: 'Agri-Tech', difficulty: 'Intermediate',
    description: 'Technology-driven farming using GPS, sensors, drones, and data analytics for optimal crop management.',
    roadmap: mkRoadmap([
      ['GIS & Remote Sensing', 'Use satellite imagery and GPS to map field variability, soil types, and crop health indicators.', '3 hours'],
      ['Variable Rate Technology', 'Implement VRT for seed, fertilizer, and pesticide application based on prescription maps.', '3 hours'],
      ['Farm Data Analytics', 'Analyze yield data, weather patterns, and soil sensors to make data-driven management decisions.', '3 hours'],
    ])},

  // ─── AGRICULTURE: forestry ───
  { name: 'Wildlife Conservation', sector: 'forestry', category: 'Wildlife Conservation', difficulty: 'Intermediate',
    description: 'Science-based approaches to protecting endangered species and preserving biodiversity in ecosystems.',
    roadmap: mkRoadmap([
      ['Population Ecology', 'Estimate wildlife populations using mark-recapture, camera traps, and statistical models.', '3 hours'],
      ['Habitat Management', 'Design wildlife corridors, restoration plans, and protected area management strategies.', '3 hours'],
      ['Conservation Policy', 'Navigate CITES, ESA, and IUCN frameworks. Develop community-based conservation programs.', '3 hours'],
    ])},

  // ─── TRADES: hospitality ───
  { name: 'Hotel Revenue Management', sector: 'hospitality', category: 'Hotel Mgmt', difficulty: 'Intermediate',
    description: 'Strategic pricing and inventory optimization to maximize hotel revenue per available room.',
    roadmap: mkRoadmap([
      ['Demand Forecasting', 'Analyze booking patterns, seasonality, and market segmentation to predict occupancy rates.', '3 hours'],
      ['Dynamic Pricing', 'Implement rate fences, length-of-stay controls, and competitive pricing using revenue management systems.', '3 hours'],
      ['Distribution Strategy', 'Optimize OTA, direct booking, and GDS channel mix. Manage rate parity and commission costs.', '3 hours'],
    ])},

  // ─── TRADES: aviation ───
  { name: 'Aviation Meteorology', sector: 'aviation', category: 'Pilot Training', difficulty: 'Intermediate',
    description: 'Weather science applied to flight safety — understanding turbulence, icing, thunderstorms, and visibility.',
    roadmap: mkRoadmap([
      ['Atmospheric Fundamentals', 'Learn pressure systems, fronts, air masses, and stability concepts relevant to aviation.', '3 hours'],
      ['Weather Hazards', 'Identify and mitigate thunderstorms, wind shear, icing, fog, and mountain wave turbulence.', '3 hours'],
      ['Charts & Briefings', 'Read METAR, TAF, SIGMET, and upper-wind charts. Use weather briefing resources for flight planning.', '3 hours'],
    ])},

  // ─── TRADES: skilled_trades ───
  { name: 'Electrical Wiring & Codes', sector: 'skilled_trades', category: 'Electrician', difficulty: 'Intermediate',
    description: 'Residential and commercial electrical installation following NEC standards and safety practices.',
    roadmap: mkRoadmap([
      ['Circuits & Load Calculations', 'Understand series/parallel circuits, Ohm\'s law, and NEC load calculation methods for panel sizing.', '3 hours'],
      ['Wiring Methods', 'Install NM cable, conduit, and raceway systems. Wire switches, outlets, and 3-way/4-way circuits.', '4 hours'],
      ['Code Compliance & Safety', 'Apply NEC grounding, bonding, GFCI/AFCI requirements. Prepare for inspections and permits.', '3 hours'],
    ])},
];

// ==============================
// SEED FUNCTION
// ==============================
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    let inserted = 0;
    let skipped = 0;

    for (const tech of TECHNOLOGIES) {
      const slug = slugify(tech.name);
      const exists = await Technology.findOne({ slug });

      if (exists) {
        console.log(`  ⏭  SKIP: "${tech.name}" (already exists)`);
        skipped++;
        continue;
      }

      await Technology.create({ ...tech, slug });
      console.log(`  ✅ CREATED: "${tech.name}" → sector: ${tech.sector}`);
      inserted++;
    }

    console.log(`\n🎉 Seed complete! Inserted: ${inserted}, Skipped: ${skipped}`);
    process.exit(0);

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
