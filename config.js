/* ==========================================================================
   SITE CONFIG  -  the ONLY file you need to edit for day-to-day changes.
   --------------------------------------------------------------------------
   * Change text, links, colours, resume entries, books ... right here.
   * Add a project : 1) make a folder  content/projects/<slug>/
                     2) put index.md (+ cover.svg/jpg, PDFs, images) inside it
                     3) add ONE block to the `projects` list below.
   * Add a blog post: same idea with content/blog/<slug>/ and the `posts` list.
   * Nothing to build or compile. Save, refresh the browser, done.
   ========================================================================== */

window.SITE_CONFIG = {

  /* ------------------------------ Site ---------------------------------- */
  site: {
    name: "Mahran Sayed",
    title: "Mahran Sayed | Aerospace & Hydrodynamics Engineer",
    description: "Portfolio, resume and blog of Mahran Sayed, an aerospace engineer working on marine hydrodynamics, CFD and propeller design.",
    footer: "",               // optional text after the copyright line
  },

  /* ------------------------------ Theme --------------------------------- */
  theme: {
    defaultMode: "dark",      // "dark" or "light" (visitors can toggle)
    accent: "#38e1ff",        // main accent colour (cyan). Try "#7cf29a" or "#ff9d4d"
    accent2: "#ffb454",       // secondary accent (amber)
    accentLight: "#0b6bcb",   // same two colours used in light mode
    accent2Light: "#c4620a",
    flowAnimation: true,      // animated streamlines behind the hero
    heroScenes: ["airfoil"],  // hero animations ("airfoil", "propeller"); list several to cycle between them
    heroCycleSeconds: 18,     // seconds per hero scene; 0 = no auto-cycle
  },

  /* ------------------------------ Hero ---------------------------------- */
  hero: {
    kicker: "AEROSPACE  /  HYDRODYNAMICS  /  CFD",
    name: "Mahran Sayed",
    tagline: "Aerospace engineer working on how fluids move around things that fly, float and dive.",
    // These words rotate under the name:
    rotating: ["Aerodynamics", "Marine hydrodynamics", "CFD", "Propeller design", "Space systems"],
  },

  /* ------------------------------ About --------------------------------- */
  profile: {
    fullName: "Mahran Sayed",
    headline: "Hydrodynamics & CFD Engineer  |  Aerospace Engineer",
    location: "Cairo, Egypt",
    coords: "",               // optional small coordinates label next to the location in the hero
    // Put your photo at assets/img/profile.webp (square works best).
    // If the file is missing, a monogram is shown instead.
    photo: "assets/img/profile.webp",
    monogram: "MS",
    about: [
      "Hi, I'm Mahran, an aerospace engineer who ended up in marine hydrodynamics. I graduated from Cairo University (**Distinction with Honour, 8th in my class**) and now work as a Hydrodynamics and CFD Engineer at MCS Oil, on underwater vehicles, thrusters and propellers.",
      "At university I built CubeSats, CanSats, UAVs and a LEO ground station. The same equations govern air and water, so the move from aircraft to ROVs felt like a change of Reynolds number, not of field.",
    ],
    focus: [
      { icon: "wing",   title: "Aerodynamics & Flight", text: "Fixed-wing UAV design, flat-plate and airfoil aerodynamics, flight control." },
      { icon: "wave",   title: "Marine Hydrodynamics",  text: "Drag, resistance, seakeeping, thrusters and propeller design for ROVs and vessels." },
      { icon: "orbit",  title: "Space Systems",         text: "CubeSat and CanSat structures, power systems, PCBs and a LEO ground station." },
      { icon: "code",   title: "Engineering Tools",     text: "Python, MATLAB and JavaScript tools that turn repetitive engineering work into one click." },
    ],
  },

  /* ------------------------------ Social -------------------------------- */
  // icon: linkedin | github | mail | youtube   (heroIcon = optional different icon for the small round buttons in the hero)
  social: [
    { label: "LinkedIn",        icon: "linkedin", url: "https://www.linkedin.com/in/mahran-sayed" },
    { label: "GitHub",          icon: "github",   url: "https://github.com/mahran-sayed" },
    { label: "Personal email",  icon: "mail",     url: "mailto:mahransayed@outlook.com", text: "mahransayed@outlook.com" },
    { label: "Work email",      icon: "mail", heroIcon: "briefcase",     url: "mailto:m.sayed@mcsoil.com",      text: "m.sayed@mcsoil.com" },
  ],

  /* ------------------------- Home: featured work ------------------------ */
  // slugs from the `projects` list below, shown on the home page
  featuredProjects: ["rsv2-drag-matrix", "thruster-cad-generator", "leo-ground-station", "banner-towing-uav"],

  /* ----------------- Home: what I do at MCS (no tool names!) ------------ */
  capabilities: {
    title: "Hydrodynamics at MCS Oil",
    items: [
      "Thruster selection, design, CAD modelling and simulation",
      "Geometry preparation, simplification and high-quality mesh generation (structured and unstructured: tetrahedral, polyhedral, hexcore and poly-hexcore)",
      "Hydrofoils",
      "Hand calculations for drag estimation and lower-fidelity tools for conceptual design",
      "Post-processing and data analysis of CFD results",
      "RAO calculations for surface vessels",
      "Multiphase flow simulations for hull resistance",
      "Angular drag (rotating-arm test) simulations",
      "DEM (Discrete Element Method) simulations",
    ],
  },

  /* ------------------------------ Books --------------------------------- */
  books: {
    title: "Favourite Books",
    subtitle: "The ones that live on my desk.",
    items: [
      { title: "Fundamentals of Fluid Mechanics",     author: "Munson, Young & Okiishi",   tag: "Fluids" },
      { title: "Fundamentals of Aerodynamics",        author: "John D. Anderson",          tag: "Aerodynamics" },
      { title: "Basic Ship Theory",                   author: "K. J. Rawson & E. C. Tupper", tag: "Naval architecture" },
      { title: "Marine Propellers and Propulsion",    author: "John Carlton",              tag: "Propulsion" },
      { title: "Shigley's Mechanical Engineering Design", author: "Budynas & Nisbett",     tag: "Machine design" },
      { title: "Machine Design: An Integrated Approach",  author: "Robert L. Norton",      tag: "Machine design" },
      { title: "Fluid-Dynamic Drag",                  author: "Sighard F. Hoerner",        tag: "Drag" },
      { title: "An Album of Fluid Motion",            author: "Milton Van Dyke",           tag: "Flow visualisation" },
    ],
  },

  /* ------------------------------ Resume -------------------------------- */
  resume: {
    // Optional: put your own PDF at assets/docs/cv.pdf and set  pdf: "assets/docs/cv.pdf"
    // to show a "Download PDF" button. Leave "" to get a "Print / Save as PDF" button
    // that prints this page in a clean resume layout.
    pdf: "",
    summary: "Aerospace engineer specialised in marine hydrodynamics: CFD of ROVs and thrusters, propeller design and drag estimation. Background in CubeSats, UAVs and ground-station engineering.",

    experience: [
      {
        role: "Hydrodynamics and CFD Engineer",
        org: "MCS Oil (Marine Construction Services)",
        orgUrl: "https://www.linkedin.com/company/marine-construction-services/",
        period: "May 2025 - Present",
        bullets: [
          "Developed the complete drag matrix (Fossen's model) of RSV2 in its different operating modes.",
          "Built the CAD-generation part of the MCS in-house thruster code for propeller series such as AU, Kaplan and B-series.",
          "Thruster selection, design, CAD modelling and simulation.",
          "Geometry preparation and simplification, and high-quality structured and unstructured meshes (tetrahedral, polyhedral, hexcore, poly-hexcore).",
          "Simulations of hydrofoils, angular drag (rotating-arm test), multiphase flow for hull resistance, and DEM.",
          "RAO calculations of surface vessels.",
          "Hand calculations of drag and lower-fidelity tools for conceptual design; post-processing and analysis of CFD data.",
        ],
      },
      {
        role: "Mechanical Designer",
        org: "ESPI (Egyptian for Steel Products Industries)",
        orgUrl: "https://www.linkedin.com/company/egyptian-for-steel-products-industries-espi",
        period: "Apr 2025 - May 2025",
        bullets: [
          "Designed mechanical parts and molds for powder metallurgy.",
        ],
      },
      {
        role: "PCB and Power Subsystem Team Head",
        org: "SSTLab, Cairo University",
        orgUrl: "https://www.linkedin.com/company/sst-lab/",
        period: "Jul 2021 - Jan 2023",
        bullets: [
          "Power system sizing, including batteries and solar cells for projects such as rovers and CubeSats.",
          "Design and fabrication of PCBs for the lab's projects.",
        ],
      },
      {
        role: "R&D",
        org: "Shaghaf Scientific Toys",
        period: "Jul 2021 - Oct 2021",
        bullets: [],
      },
      {
        role: "UAV Design-Build-Fly Training and Competition",
        org: "UDC, Cairo University",
        orgUrl: "https://www.linkedin.com/company/udc-cairo-university/",
        period: "Jul 2021 - Sep 2021",
        bullets: [
          "Designed and fabricated an unmanned aerial vehicle capable of towing a banner (3rd place).",
        ],
      },
    ],

    volunteering: [
      {
        role: "Founder, Aerospace Podcast (Podcast Tayaran)",
        period: "Mar 2023 - Jul 2024",
        url: "https://www.youtube.com/@aerospace.podcast",
        text: "Hosted Cairo University engineering graduates to share their experience after graduation.",
      },
      {
        role: "Author and maintainer, Awesome Aerospace Engineering (GitHub)",
        period: "Open source",
        url: "https://github.com/mahran-sayed/awesome-aerospace-engineering",
        text: "A curated list of aerospace engineering learning resources: core subjects, skills, projects, software, podcasts and communities.",
      },
    ],

    education: [
      {
        degree: "BSc in Aerospace Engineering",
        school: "Faculty of Engineering, Cairo University",
        period: "Graduated July 2024",
        note: "Distinction with Honour. Ranked 8th in class.",
      },
    ],

    // Tools live HERE (not under the MCS job above).
    skills: [
      { group: "CAD & geometry",        items: ["SolidWorks", "OnShape", "CATIA V6", "Rhino", "SpaceClaim", "Discovery"] },
      { group: "Simulation & meshing",  items: ["Ansys Fluent", "ICEM CFD", "Ansys Mesher", "Fluent Meshing", "Ansys (CFD & FEA)"] },
      { group: "Aerodynamics & rockets", items: ["XFOIL", "XFLR5", "OpenRocket"] },
      { group: "Programming",           items: ["Python", "MATLAB", "JavaScript", "Arduino"] },
      { group: "Data acquisition",      items: ["LabView"] },
      { group: "Documents & diagrams",  items: ["LaTeX", "MS Word", "MS Excel", "draw.io"] },
    ],

    // Shown on the resume page; the full pages live in the Portfolio.
    projects: [
      { title: "Reverse structural design of the Hawaii University Artemis 1U CubeSat", year: "2025", slug: "cubesat-1u-reverse-design" },
      { title: "Design and manufacturing of a 3U CubeSat for IoT applications",           year: "2023-2024", slug: "cubesat-3u-iot" },
      { title: "Flat plate glider aerodynamics project",                                  year: "2024", slug: "flat-plate-glider" },
      { title: "Design, fabrication and testing of a LEO ground station",                 year: "2023", slug: "leo-ground-station" },
      { title: "UAV capable of towing a banner with minimum weight",                      year: "2021", slug: "banner-towing-uav" },
      { title: "CanSat design and fabrication",                                           year: "2021", slug: "cansat" },
    ],

    certifications: [
      "Introduction to Fixed-Wing Drone Design",
      "CAD & Reverse Engineering Training (Promech and GiZ)",
      "Solidworks Sheet Metal (Udemy)",
      "GD&T: Geometric Dimensioning and Tolerancing Crash Course",
      "A Hands-on Introduction to Engineering Simulations, Cornell University (edX)",
      "Computational Fluid Dynamics Fundamentals, Courses 1, 2 and 3",
    ],

    languages: [
      { name: "Arabic",  level: "Native" },
      { name: "English", level: "Advanced" },
      { name: "German",  level: "Intermediate" },
    ],
  },

  /* ----------------------------- Portfolio ------------------------------ */
  portfolio: {
    title: "Portfolio",
    intro: "Hydrodynamics work, space systems and flying machines.",
    // Optional one-pager PDF (leave "" to hide the button)
    summaryPdf: "assets/docs/previous-projects.pdf",
    summaryPdfLabel: "Download project summary (PDF)",
  },

  /*  One block per project. The page content is  content/projects/<slug>/index.md
      Fields:
        slug      folder name inside content/projects/
        title     card + page title
        subtitle  small line on the card
        category  used for the filter chips (any text; same text = same chip)
        year      shown on the page
        cover     image inside the project folder (svg, png, jpg, webp)
        tags      small labels on the project page
        links     optional buttons on the project page: [{label, url}]
  */
  projects: [
    {
      slug: "rsv2-drag-matrix",
      title: "RSV2 Drag Matrix",
      subtitle: "Complete 6-DOF drag model (Fossen) in every operating mode",
      category: "Hydrodynamics",
      year: "2025",
      cover: "ocean-aurora.webp",
      tags: ["ROV", "Drag", "Fossen model", "CFD"],
      links: [{ label: "About the vehicle", url: "https://www.mcsoil.com/ocean-aurora/" }],
    },
    {
      slug: "thruster-cad-generator",
      title: "In-house Thruster Code: CAD Generation",
      subtitle: "Parametric CAD for AU, Kaplan and B-series propellers",
      category: "Hydrodynamics",
      year: "2025",
      cover: "propeller-series.webp",
      tags: ["Propellers", "CAD", "Automation"],
    },
    {
      slug: "marine-hydrodynamics-at-mcs",
      title: "Marine Hydrodynamics at MCS",
      subtitle: "Resistance, RAOs, hydrofoils, angular drag and DEM",
      category: "Hydrodynamics",
      year: "2025 - now",
      cover: "cover.webp",
      tags: ["CFD", "Seakeeping", "Multiphase"],
    },
    {
      slug: "leo-ground-station",
      title: "LEO Ground Station",
      subtitle: "Own SGP4 propagator, Yagi antenna and 2-DOF rotator",
      category: "Space",
      year: "2023",
      cover: "cover.jpg",
      tags: ["Satellite tracking", "Antenna", "Control"],
      links: [{ label: "Full documentation", url: "https://drive.google.com/file/d/1nfr6RvnTZevmImrmRefqKJeYLXO6lmnX/view?usp=sharing" }],
    },
    {
      slug: "cubesat-3u-iot",
      title: "3U CubeSat for IoT Applications",
      subtitle: "Design and manufacturing of a 3U CubeSat",
      category: "Space",
      year: "2023-2024",
      cover: "cubesat-3u.webp",
      tags: ["CubeSat", "IoT", "Space systems"],
      links: [{ label: "Project document", url: "https://drive.google.com/file/d/1IZFEK2J1shOV9rEdcMdqJM6bTnAq4Oti/view" }],
    },
    {
      slug: "cubesat-1u-reverse-design",
      title: "1U CubeSat Reverse Structural Design",
      subtitle: "Hawaii University Artemis 1U CubeSat",
      category: "Space",
      year: "2025",
      cover: "cover.webp",
      tags: ["CubeSat", "Reverse engineering", "Structures"],
    },
    {
      slug: "cansat",
      title: "CanSat Design and Fabrication",
      subtitle: "Sensor libraries, PCBs and satellite bus",
      category: "Space",
      year: "2021",
      cover: "cover.svg",
      tags: ["Arduino", "Sensors", "PCB"],
    },
    {
      slug: "banner-towing-uav",
      title: "Banner-Towing UAV",
      subtitle: "Minimum-weight advertising UAV, 3rd place",
      category: "Aeronautics",
      year: "2021",
      cover: "cover.jpg",
      tags: ["UAV", "Design-Build-Fly", "Competition"],
      links: [{ label: "Full documentation", url: "https://drive.google.com/file/d/1SjL2jTxoy_doq0WSDx1z7XboxXMnwrqX/view?usp=sharing" }],
    },
    {
      slug: "flat-plate-glider",
      title: "Flat Plate Glider",
      subtitle: "Aerodynamics of a flat-plate glider",
      category: "Aeronautics",
      year: "2024",
      cover: "cover.webp",
      tags: ["Aerodynamics", "Glider", "Poster"],
      links: [{ label: "Poster", url: "https://drive.google.com/file/d/1_T-XYMULD0gXpPG9enW_Prci8sCRq5AI/view" }, { label: "Project folder", url: "https://drive.google.com/drive/folders/1EhyD3OMUrBtxWHzy0PJ4m6etRcSDqA2K?usp=sharing" }],
    },
    {
      slug: "autopilot-system",
      title: "Autopilot System",
      subtitle: "Flight control loop for a small aircraft",
      category: "Aeronautics",
      year: "",
      cover: "cover.svg",
      tags: ["Control", "Autopilot"],
    },
    {
      slug: "awesome-aerospace-engineering",
      title: "Awesome Aerospace Engineering",
      subtitle: "Open-source list of learning resources",
      category: "Open source",
      year: "ongoing",
      cover: "cover.webp",
      tags: ["GitHub", "Education"],
      links: [{ label: "View on GitHub", url: "https://github.com/mahran-sayed/awesome-aerospace-engineering" }],
    },
  ],

  /* ------------------------------- Blog --------------------------------- */
  blog: {
    title: "Blog",
    intro: "Notes on fluids, flight and space. (The three posts below are samples. Replace them with your own.)",
  },

  /*  One block per post. Content is  content/blog/<slug>/index.md
      Fields: slug, title, date (YYYY-MM-DD), tag, cover, summary
      Newest first is automatic (sorted by date).  */
  posts: [
    {
      slug: "drag-estimation-workflow",
      title: "From Hand Calculations to CFD: A Drag-Estimation Workflow",
      date: "2026-10-13",
      tag: "Hydrodynamics",
      cover: "cover.svg",
      summary: "Why a back-of-the-envelope drag number is the best sanity check you can give a CFD result.",
    },
    {
      slug: "propeller-open-water-basics",
      title: "Reading a Propeller Open-Water Diagram",
      date: "2026-10-12",
      tag: "Propellers",
      cover: "cover.svg",
      summary: "J, KT, KQ and efficiency: the four things every propeller chart is telling you.",
    },
    {
      slug: "aerospace-meets-marine",
      title: "Same Equations, Different Regime: Aerospace Meets Marine",
      date: "2026-10-11",
      tag: "Aerospace",
      cover: "cover.svg",
      summary: "What carries over from aircraft to underwater vehicles, and what absolutely does not.",
    },
  ],
};
