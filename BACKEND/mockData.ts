import { Profile, Round, Team, EvaluationCriteria, Evaluation, EvaluationScore } from "@shared/types/database";

export const MOCK_PROFILES: Profile[] = [
  {
    id: "prof-1",
    login_id: "JDG10001",
    pin: "1234",
    name: "Dr. Rajesh Kumar (AI Judge)",
    role: "judge",
  },
  {
    id: "prof-2",
    login_id: "JDG10002",
    pin: "5678",
    name: "Prof. Sunita Sharma (Industry Judge)",
    role: "judge",
  },
  {
    id: "prof-3",
    login_id: "MNR20001",
    pin: "4321",
    name: "Arjun Verma (Technical Mentor)",
    role: "mentor",
  },
  {
    id: "prof-4",
    login_id: "MNR20002",
    pin: "8765",
    name: "Kavya Rao (Design Mentor)",
    role: "mentor",
  },
];

export const MOCK_ROUNDS: Round[] = [
  {
    id: "round-1",
    round_number: 1,
    round_name: "Grand Hackathon Evaluation Round",
    description: "Official comprehensive evaluation of problem understanding, technical feasibility, prototype demo, and presentation.",
    is_active: true,
  },
];

export const MOCK_TEAMS: Team[] = [
  {
    id: "team-1",
    team_code: "VV-101",
    name: "ByteCrafters",
    domain: "Artificial Intelligence",
    case_study: "Automated Medical Image Triage System for Rural Clinics",
    canva_url: "https://www.canva.com/design/DAFtest1/view",
    drive_url: "https://drive.google.com/drive/folders/1testByteCraftersProto",
    members: [
      { id: "m-1", team_id: "team-1", name: "Rahul Sharma", branch: "CSE", is_lead: true },
      { id: "m-2", team_id: "team-1", name: "Priya Nair", branch: "AIML", is_lead: false },
      { id: "m-3", team_id: "team-1", name: "Karthik Rao", branch: "ISE", is_lead: false },
    ],
  },
  {
    id: "team-2",
    team_code: "VV-102",
    name: "NeuroPulse",
    domain: "HealthTech & IoT",
    case_study: "Non-Invasive Glucose Monitoring & Continuous Health Telemetry",
    canva_url: "https://www.canva.com/design/DAFtest2/view",
    drive_url: "https://drive.google.com/drive/folders/1testNeuroPulseProto",
    members: [
      { id: "m-4", team_id: "team-2", name: "Sneha Patel", branch: "ECE", is_lead: true },
      { id: "m-5", team_id: "team-2", name: "Aditya Joshi", branch: "CSE", is_lead: false },
    ],
  },
  {
    id: "team-3",
    team_code: "VV-103",
    name: "BlockShield",
    domain: "Cybersecurity & Web3",
    case_study: "Decentralized Zero-Knowledge Identity Verification for Universities",
    canva_url: "https://www.canva.com/design/DAFtest3/view",
    drive_url: null,
    members: [
      { id: "m-6", team_id: "team-3", name: "Vikram Verma", branch: "CyberSecurity", is_lead: true },
      { id: "m-7", team_id: "team-3", name: "Ananya Sen", branch: "ISE", is_lead: false },
    ],
  },
  {
    id: "team-4",
    team_code: "VV-104",
    name: "EcoSync",
    domain: "CleanTech & Smart Cities",
    case_study: "Smart Urban Waste Bin Telemetry & Fuel-Efficient Route Optimization",
    canva_url: "https://www.canva.com/design/DAFtest4/view",
    drive_url: "https://drive.google.com/drive/folders/1testEcoSyncProto",
    members: [
      { id: "m-8", team_id: "team-4", name: "Rohan Kulkarni", branch: "Mechanical / Mechatronics", is_lead: true },
      { id: "m-9", team_id: "team-4", name: "Divya Hegde", branch: "CSE", is_lead: false },
    ],
  },
  {
    id: "team-5",
    team_code: "VV-105",
    name: "CodeCatalyst",
    domain: "FinTech",
    case_study: "Micro-Credit Scoring and Instant Liquidity Pool for Gig Workers",
    canva_url: "https://www.canva.com/design/DAFtest5/view",
    drive_url: null,
    members: [
      { id: "m-10", team_id: "team-5", name: "Tarun Reddy", branch: "ISE", is_lead: true },
      { id: "m-11", team_id: "team-5", name: "Meera Menon", branch: "AIML", is_lead: false },
    ],
  },
];

export const MOCK_CRITERIA: EvaluationCriteria[] = [
  {
    id: "crit-1",
    round_id: "round-1",
    name: "Problem Understanding & Domain Relevance",
    description: "Clarity of the defined problem, relevance of the case study, and depth of initial research.",
    max_marks: 10,
    sort_order: 1,
  },
  {
    id: "crit-2",
    round_id: "round-1",
    name: "Innovation & Technical Architecture",
    description: "Uniqueness of the proposed solution, system design, and software craftsmanship.",
    max_marks: 15,
    sort_order: 2,
  },
  {
    id: "crit-3",
    round_id: "round-1",
    name: "Working Prototype & Implementation Quality",
    description: "Feasibility, completeness of live demonstration, and functional depth of prototype.",
    max_marks: 15,
    sort_order: 3,
  },
  {
    id: "crit-4",
    round_id: "round-1",
    name: "Presentation, Slide Deck & Q&A Response",
    description: "Clarity of Canva presentation, articulation, team synchronization, and answering jury questions.",
    max_marks: 10,
    sort_order: 4,
  },
];
