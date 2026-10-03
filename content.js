/**
 * Edit this file, then redeploy. Nothing else needs to change.
 * Starter copy is sample material — replace it before you treat the site as live.
 */
window.PORTFOLIO = {
  name: "Abhishek Kumar",
  title: "Data Scientist",
  username: "abhishek",
  hostname: "portfolio",
  location: "India",
  email: "hello@abhishekrthakur.me",
  website: "https://abhishekrthakur.me",
  github: "https://github.com/your-username",
  githubLabel: "@your-username",
  linkedin: "https://www.linkedin.com/in/your-linkedin",
  linkedinLabel: "/in/your-linkedin",
  kaggle: "https://www.kaggle.com/your-username",
  kaggleLabel: "kaggle.com/your-username",

  // Link to your actual resume PDF
  resumeUrl: "ABHISHEK KUMAR_ML_Resume.pdf",
  resumeLabel: "ABHISHEK KUMAR_ML_Resume.pdf",

  // Background music
  musicFile: "music.mp3",
  musicTitle: "Tum Hi Ho (Aashiqui 2)",

  welcome: `Hi, I'm Abhishek Kumar — Data Scientist based in India.

I build ML systems that survive contact with production: honest evaluations,
clean feature pipelines, and models people can actually trust.

Type 'help' to see what's available, or click any command above.`,

  about: `I'm Abhishek Kumar. I turn messy tables into models people can actually trust.
If it needs a feature pipeline, an honest evaluation, or a notebook that
survives contact with production — I'm in.

These days that means classical ML and deep learning, experiment tracking,
and the unglamorous work of making a metric mean the same thing on Tuesday
that it meant on Monday.

→ Starter bio — replace this paragraph in content.js.`,

  projects: [
    {
      name: "AI Sales Analytics",
      tech: ["Python", "SQL", "Tableau", "n8n"],
      summary: "Automated sales analytics & reporting system.",
      details: "End-to-end pipeline: warehouse features, automated insights, and a scored batch the ops team can actually use. Includes leakage checklist and weekly retrain.",
      github: "https://github.com/your-username",
      githubLabel: "GitHub",
      demo: "https://abhishekrthakur.me",
      demoLabel: "Case Study",
    },
    {
      name: "Experiment Ledger",
      tech: ["Python", "MLflow", "DuckDB", "Streamlit"],
      summary: "Lightweight experiment tracker for offline model runs.",
      details: "Parameters, metrics, and dataset hashes in one place. Built so a result can be reproduced without hunting through notebook history.",
      github: "https://github.com/your-username",
      githubLabel: "GitHub",
      demo: "https://abhishekrthakur.me",
      demoLabel: "Live Demo",
    },
    {
      name: "Doc RAG",
      tech: ["Python", "FastAPI", "Embeddings", "PostgreSQL"],
      summary: "Retrieval assistant over internal docs with citation snippets.",
      details: "Includes a refusal path when the corpus doesn't support the answer, plus an evaluation set of question-answer pairs — not just a demo chat box.",
      github: "https://github.com/your-username",
      githubLabel: "GitHub",
      demo: "https://abhishekrthakur.me",
      demoLabel: "Case Study",
    },
  ],

  skills: [
    { group: "Languages",  items: "Python, SQL, R" },
    { group: "Data",       items: "pandas, NumPy, Polars, DuckDB, PostgreSQL" },
    { group: "Modeling",   items: "scikit-learn, XGBoost, LightGBM, PyTorch, statsmodels" },
    { group: "Practice",   items: "feature stores, cross-validation, calibration, experiment tracking" },
    { group: "Delivery",   items: "FastAPI, Streamlit, Docker, basic Airflow" },
    { group: "Viz",        items: "Matplotlib, Plotly, Tableau" },
  ],

  experience: [
    {
      company: "Your Company — edit this",
      role: "Data Scientist",
      when: "Jan 2023 – Present",
      bullets: [
        "Replace these bullets with your actual work in content.js",
        "Focus on outcomes and impact, not just tools used",
        "e.g. Reduced churn model latency by 40% via feature store refactor",
      ],
    },
    {
      company: "Previous Company — optional",
      role: "Data Analyst",
      when: "Jun 2021 – Dec 2022",
      bullets: [
        "Another role — delete this block if you don't need it",
        "Keep only entries you want on the public site",
      ],
    },
  ],

  education: [
    {
      school: "Your University — edit this",
      credential: "Degree in a quantitative field",
      when: "Year – Year",
      note: "Replace this block in content.js before you publish.",
    },
    {
      school: "Second program — optional, delete if unused",
      credential: "Certificate or online specialization",
      when: "Year",
      note: "",
    },
  ],

  focus: [
    "Shipping models with a validation story",
    "Voice and text evaluation sets, not vibes",
    "Clean feature pipelines",
  ],
};