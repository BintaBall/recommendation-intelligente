// article-service/src/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Chargement des variables d'environnement
dotenv.config();

// Connexion à MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/articles-platform';

// Définition du modèle Article
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  content: { type: String, required: true },
  domain: { type: String, required: true },
  authors: [{ type: String }],
  publicationDate: { type: Date, default: Date.now },
  keywords: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);

// Données de démonstration - 50 articles de différents domaines
const sampleArticles = [
  // Informatique
  {
    title: "Advances in Deep Learning Architectures for Natural Language Processing",
    abstract: "This paper explores recent advancements in deep learning architectures specifically designed for natural language processing tasks.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Computer Science",
    authors: ["Zhang Wei", "Maria Rodriguez"],
    keywords: ["deep learning", "NLP", "transformer", "BERT"],
    publicationDate: new Date("2023-01-15")
  },
  {
    title: "Quantum Computing Applications in Cryptography",
    abstract: "A comprehensive review of how quantum computing technologies may impact current cryptographic standards and protocols.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Computer Science",
    authors: ["David Chen", "Sarah Johnson"],
    keywords: ["quantum computing", "cryptography", "security"],
    publicationDate: new Date("2022-11-03")
  },
  {
    title: "Federated Learning for Privacy-Preserving AI",
    abstract: "This study presents an approach to machine learning that allows training algorithms across multiple decentralized devices without exchanging data samples.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Computer Science",
    authors: ["Jamal Williams", "Emma Taylor"],
    keywords: ["federated learning", "privacy", "distributed systems"],
    publicationDate: new Date("2023-02-20")
  },
  {
    title: "Blockchain Technology for Supply Chain Management",
    abstract: "An analysis of how blockchain can be implemented to improve transparency and efficiency in global supply chains.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Computer Science",
    authors: ["Robert Brown", "Ananya Patel"],
    keywords: ["blockchain", "supply chain", "distributed ledger"],
    publicationDate: new Date("2022-09-12")
  },
  {
    title: "Edge Computing Architectures for IoT Environments",
    abstract: "This paper discusses design patterns for implementing edge computing solutions in various IoT scenarios.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Computer Science",
    authors: ["Lisa Wong", "Carlos Mendez"],
    keywords: ["edge computing", "IoT", "distributed systems"],
    publicationDate: new Date("2023-03-05")
  },
  {
    title: "Reinforcement Learning for Autonomous Driving Systems",
    abstract: "This research explores applications of reinforcement learning algorithms in developing self-driving vehicle capabilities.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Computer Science",
    authors: ["Thomas Schmidt", "Aisha Owens"],
    keywords: ["reinforcement learning", "autonomous vehicles", "AI"],
    publicationDate: new Date("2022-12-18")
  },
  {
    title: "Explainable AI: Methods and Challenges",
    abstract: "An overview of techniques to make AI decisions more transparent and interpretable to human users.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Computer Science",
    authors: ["Julia Martinez", "Kofi Adeyemi"],
    keywords: ["XAI", "explainable AI", "interpretability"],
    publicationDate: new Date("2023-01-30")
  },
  {
    title: "Cybersecurity in Healthcare Information Systems",
    abstract: "A study of vulnerabilities and protection mechanisms in modern healthcare IT infrastructure.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Computer Science",
    authors: ["Daniel Kim", "Olivia Nelson"],
    keywords: ["cybersecurity", "healthcare", "information systems"],
    publicationDate: new Date("2022-10-25")
  },
  {
    title: "Graph Neural Networks for Knowledge Graph Completion",
    abstract: "This paper presents novel graph neural network architectures for predicting missing links in knowledge graphs.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Computer Science",
    authors: ["Elena Popova", "James Wilson"],
    keywords: ["graph neural networks", "knowledge graphs", "link prediction"],
    publicationDate: new Date("2023-02-08")
  },
  {
    title: "Cloud-Native Architectures for Microservices Deployment",
    abstract: "A comprehensive guide to designing and implementing cloud-native applications using microservices patterns.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Computer Science",
    authors: ["Mark Thompson", "Fatima Al-Zahra"],
    keywords: ["cloud-native", "microservices", "kubernetes"],
    publicationDate: new Date("2022-08-19")
  },
  
  // Physique
  {
    title: "Advancements in Quantum Field Theory and String Theory",
    abstract: "This paper discusses recent theoretical developments in unifying quantum field theory with string theory.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Physics",
    authors: ["Richard Feynman Jr.", "Lisa Randall"],
    keywords: ["quantum field theory", "string theory", "theoretical physics"],
    publicationDate: new Date("2023-01-22")
  },
  {
    title: "Experimental Evidence for Dark Matter in Galaxy Clusters",
    abstract: "New observational data providing stronger constraints on the nature of dark matter in distant galaxy clusters.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Physics",
    authors: ["Vera Rubin II", "Neil deGrasse"],
    keywords: ["dark matter", "astrophysics", "galaxy clusters"],
    publicationDate: new Date("2022-11-15")
  },
  {
    title: "Quantum Computing: Beyond NISQ Era Devices",
    abstract: "This research presents potential architectures for fault-tolerant quantum computers that can scale beyond current noisy intermediate-scale quantum devices.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Physics",
    authors: ["Quantum Zhang", "Qubit Johnson"],
    keywords: ["quantum computing", "fault tolerance", "quantum error correction"],
    publicationDate: new Date("2023-02-28")
  },
  {
    title: "Topological Phases in Quantum Matter",
    abstract: "An exploration of exotic quantum states characterized by topological properties with potential applications in quantum computing.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Physics",
    authors: ["Thouless Davis", "Kane Mele"],
    keywords: ["topological insulators", "quantum matter", "condensed matter physics"],
    publicationDate: new Date("2022-09-30")
  },
  {
    title: "Gravitational Wave Detection: Methods and Future Observatories",
    abstract: "This paper outlines improved detection techniques and upcoming observatories for gravitational wave astronomy.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Physics",
    authors: ["Kip S. Thorne", "Gabriela González"],
    keywords: ["gravitational waves", "LIGO", "astrophysics", "general relativity"],
    publicationDate: new Date("2023-03-12")
  },
  {
    title: "Novel Superconducting Materials for Room Temperature Applications",
    abstract: "Research into new materials that exhibit superconducting properties at significantly higher temperatures than conventional superconductors.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Physics",
    authors: ["Cooper Bardeen", "Alexei Abrikosov"],
    keywords: ["superconductivity", "materials science", "high temperature"],
    publicationDate: new Date("2022-12-05")
  },
  {
    title: "Testing Quantum Gravity Models with Black Hole Physics",
    abstract: "This study proposes experimental approaches to test various quantum gravity theories using black hole information paradox.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Physics",
    authors: ["Stephen W. Hawking", "Juan Maldacena"],
    keywords: ["quantum gravity", "black holes", "theoretical physics"],
    publicationDate: new Date("2023-01-18")
  },
  {
    title: "Fusion Energy: Progress in Magnetic Confinement",
    abstract: "Recent advancements in tokamak design and plasma confinement for commercial fusion energy production.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Physics",
    authors: ["Tokamak Iter", "Fusion Stellarator"],
    keywords: ["fusion energy", "plasma physics", "tokamak", "clean energy"],
    publicationDate: new Date("2022-10-10")
  },
  {
    title: "Quantum Sensors for Enhanced Gravitational Measurements",
    abstract: "Development of quantum technology-based sensors with unprecedented precision for measuring gravitational fields.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Physics",
    authors: ["Planck Einstein", "Bohr Heisenberg"],
    keywords: ["quantum sensing", "gravimetry", "precision measurements"],
    publicationDate: new Date("2023-02-03")
  },
  {
    title: "Particle Physics Beyond the Standard Model",
    abstract: "Theoretical frameworks and experimental evidence challenging aspects of the Standard Model of particle physics.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Physics",
    authors: ["Higgs Boson", "Neutrino Oscillation"],
    keywords: ["particle physics", "standard model", "supersymmetry"],
    publicationDate: new Date("2022-08-25")
  },
  
  // Médecine
  {
    title: "CRISPR-Based Gene Therapy for Inherited Blood Disorders",
    abstract: "Clinical trials results for gene editing approaches to treating sickle cell disease and beta-thalassemia.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Medicine",
    authors: ["Jennifer Doudna", "Feng Zhang"],
    keywords: ["CRISPR", "gene therapy", "sickle cell", "hematology"],
    publicationDate: new Date("2023-01-08")
  },
  {
    title: "Neuroimaging Biomarkers for Early Alzheimer's Detection",
    abstract: "Novel brain imaging techniques that can identify Alzheimer's disease years before symptoms appear.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Medicine",
    authors: ["Alois Memory", "Neuroplasticity Jones"],
    keywords: ["alzheimer's", "neuroimaging", "early detection", "neurology"],
    publicationDate: new Date("2022-11-27")
  },
  {
    title: "mRNA Vaccine Technology for Cancer Immunotherapy",
    abstract: "Adapting mRNA vaccine platforms for personalized cancer treatments that target tumor-specific antigens.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Medicine",
    authors: ["Katalin Karikó", "Drew Weissman"],
    keywords: ["mRNA", "cancer", "immunotherapy", "personalized medicine"],
    publicationDate: new Date("2023-02-15")
  },
  {
    title: "Gut Microbiome Influence on Neurological Disorders",
    abstract: "Evidence for gut-brain axis involvement in conditions such as Parkinson's disease, anxiety, and depression.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Medicine",
    authors: ["Microbiota Enterica", "Brain Gutson"],
    keywords: ["microbiome", "gut-brain axis", "neurological disorders"],
    publicationDate: new Date("2022-09-20")
  },
  {
    title: "Artificial Intelligence for Medical Imaging Diagnostics",
    abstract: "Performance comparison of deep learning systems versus radiologists in detecting conditions from various imaging modalities.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Medicine",
    authors: ["Radiology AI", "Deep Learning MD"],
    keywords: ["AI", "medical imaging", "diagnostics", "radiology"],
    publicationDate: new Date("2023-03-20")
  },
  {
    title: "Telemedicine Outcomes in Rural Healthcare Settings",
    abstract: "Analysis of the effectiveness of telemedicine programs in underserved rural communities over a five-year period.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Medicine",
    authors: ["Rural Health", "Tele Medicine"],
    keywords: ["telemedicine", "rural healthcare", "health equity"],
    publicationDate: new Date("2022-12-12")
  },
  {
    title: "Novel Antibiotics from Deep Sea Microorganisms",
    abstract: "Discovery of new antibiotic compounds from previously unexplored marine microbial ecosystems.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Medicine",
    authors: ["Marine Bacteria", "Alexander Fleming II"],
    keywords: ["antibiotics", "drug discovery", "marine biology", "microbiology"],
    publicationDate: new Date("2023-01-25")
  },
  {
    title: "3D Bioprinting of Functional Human Organs",
    abstract: "Progress in creating transplantable organ tissues using patient-derived cells and advanced bioprinting technology.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Medicine",
    authors: ["Organ Printer", "Tissue Engineer"],
    keywords: ["bioprinting", "organ transplantation", "regenerative medicine"],
    publicationDate: new Date("2022-10-05")
  },
  {
    title: "Precision Medicine Approaches for Autoimmune Diseases",
    abstract: "Targeted therapies based on individual genetic and immunological profiles of patients with autoimmune conditions.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Medicine",
    authors: ["Immunology Specialist", "Genetic Profile"],
    keywords: ["precision medicine", "autoimmune", "personalized treatment"],
    publicationDate: new Date("2023-02-22")
  },
  {
    title: "Sleep Disorders and Their Impact on Cardiovascular Health",
    abstract: "Long-term study on the relationship between various sleep pathologies and heart disease risk factors.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Medicine",
    authors: ["Cardiac Sleep", "REM Heartbeat"],
    keywords: ["sleep medicine", "cardiology", "sleep apnea", "heart health"],
    publicationDate: new Date("2022-08-30")
  },
  
  // Biologie
  {
    title: "Single-Cell Genomics in Developmental Biology",
    abstract: "Application of single-cell RNA sequencing to track cellular differentiation during embryonic development.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Biology",
    authors: ["Cell Developer", "RNA Sequencer"],
    keywords: ["single-cell genomics", "developmental biology", "RNA-seq"],
    publicationDate: new Date("2023-01-12")
  },
  {
    title: "CRISPR-Based Tools for Ecological Conservation",
    abstract: "Ethical considerations and technical approaches for using gene editing in endangered species preservation.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Biology",
    authors: ["Conservation Geneticist", "Endangered Editor"],
    keywords: ["CRISPR", "conservation biology", "genetic rescue", "biodiversity"],
    publicationDate: new Date("2022-11-09")
  },
  {
    title: "Epigenetic Changes in Response to Environmental Stressors",
    abstract: "How various environmental factors influence epigenetic modifications across multiple generations.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Biology",
    authors: ["Epigene Marker", "Methyl Transferase"],
    keywords: ["epigenetics", "environmental biology", "methylation", "histone modification"],
    publicationDate: new Date("2023-02-25")
  },
  {
    title: "Synthetic Biology Approaches to Carbon Fixation",
    abstract: "Engineered microorganisms with enhanced abilities to capture carbon dioxide for environmental remediation.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Biology",
    authors: ["Carbon Fixer", "Synthetic Engineer"],
    keywords: ["synthetic biology", "carbon fixation", "climate change", "bioengineering"],
    publicationDate: new Date("2022-09-05")
  },
  {
    title: "Plant Communication Networks Through Mycorrhizal Fungi",
    abstract: "Evidence for complex information exchange between plants via underground fungal networks.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Biology",
    authors: ["Myco Network", "Plant Communicator"],
    keywords: ["mycorrhizal networks", "plant communication", "forest ecology"],
    publicationDate: new Date("2023-03-15")
  },
  {
    title: "Cellular Mechanisms of Aging and Senescence",
    abstract: "Molecular pathways involved in cellular aging and potential interventions to slow the process.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Biology",
    authors: ["Telomere Length", "Senescent Cell"],
    keywords: ["aging", "senescence", "cellular biology", "longevity"],
    publicationDate: new Date("2022-12-20")
  },
  {
    title: "Microbial Diversity in Extreme Environments",
    abstract: "Metagenomic analysis of previously uncharacterized microorganisms from deep-sea hydrothermal vents.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Biology",
    authors: ["Extremophile Hunter", "Deep Sea Microbiologist"],
    keywords: ["microbiology", "extremophiles", "metagenomics", "biodiversity"],
    publicationDate: new Date("2023-01-03")
  },
  {
    title: "Circadian Rhythm Regulation in Plants and Animals",
    abstract: "Comparative analysis of molecular clock mechanisms across different kingdoms of life.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Biology",
    authors: ["Circadian Clock", "Diurnal Rhythm"],
    keywords: ["circadian rhythms", "chronobiology", "molecular clock"],
    publicationDate: new Date("2022-10-18")
  },
  {
    title: "Neuroplasticity in Adult Learning and Memory Formation",
    abstract: "Cellular and molecular basis of brain adaptability in forming new memories throughout adulthood.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Biology",
    authors: ["Neural Plasticity", "Memory Former"],
    keywords: ["neuroplasticity", "neuroscience", "memory formation", "adult learning"],
    publicationDate: new Date("2023-02-10")
  },
  {
    title: "Evolutionary Adaptations to Climate Change",
    abstract: "Evidence for rapid evolutionary responses in certain species facing environmental pressures from climate change.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Biology",
    authors: ["Climate Adapter", "Evolution Speed"],
    keywords: ["evolutionary biology", "climate change", "adaptation", "natural selection"],
    publicationDate: new Date("2022-08-15")
  },

  // Chimie
  {
    title: "Sustainable Catalysis with Earth-Abundant Metals",
    abstract: "Development of catalytic systems using non-precious metals for sustainable chemical synthesis.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Chemistry",
    authors: ["Catalyst Designer", "Green Chemistry"],
    keywords: ["catalysis", "sustainable chemistry", "transition metals"],
    publicationDate: new Date("2023-01-28")
  },
  {
    title: "Novel Polymer Materials for Renewable Energy Storage",
    abstract: "Synthesis and characterization of advanced polymer-based materials for next-generation batteries.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Chemistry",
    authors: ["Polymer Scientist", "Battery Material"],
    keywords: ["polymers", "energy storage", "materials chemistry", "battery"],
    publicationDate: new Date("2022-11-20")
  },
  {
    title: "Microplastics Degradation by Enzymatic Processes",
    abstract: "Discovery of enzymes capable of breaking down common microplastics under environmentally relevant conditions.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Chemistry",
    authors: ["Enzyme Hunter", "Plastic Degrader"],
    keywords: ["microplastics", "enzymes", "biodegradation", "environmental chemistry"],
    publicationDate: new Date("2023-02-18")
  },
  {
    title: "Carbon Dioxide Capture and Utilization Technologies",
    abstract: "Comparison of various chemical approaches to capturing atmospheric CO₂ and converting it to valuable products.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Chemistry",
    authors: ["Carbon Capture", "CO₂ Utilizer"],
    keywords: ["carbon capture", "CO₂ utilization", "climate chemistry", "sustainable chemistry"],
    publicationDate: new Date("2022-09-25")
  },
  {
    title: "Pharmaceutical Green Chemistry: Sustainable Drug Synthesis",
    abstract: "Implementation of green chemistry principles in industrial-scale pharmaceutical manufacturing processes.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam auctor, nisl ac ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    domain: "Chemistry",
    authors: ["Green Pharma", "Sustainable Synthesis"],
    keywords: ["green chemistry", "pharmaceuticals", "sustainable manufacturing", "drug synthesis"],
    publicationDate: new Date("2023-03-08")
  }
];

// Fonction pour initialiser la base de données
async function seedDatabase() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Suppression des articles existants
    await Article.deleteMany({});
    console.log('Existing articles cleaned');

    // Insertion des articles
    const result = await Article.insertMany(sampleArticles);
    console.log(`${result.length} articles inserted successfully`);

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  } finally {
    // Fermeture de la connexion
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Exécuter le script
seedDatabase();
