import { Profile, Round, Team, EvaluationCriteria, Evaluation, EvaluationScore } from "@shared/types/database";

export const MOCK_PROFILES: Profile[] = [
  {
    id: "prof-1",
    login_id: "JDG10001",
    pin: "1234",
    full_name: "Dr. Rajesh Kumar (AI Judge)",
    role: "judge",
  },
  {
    id: "prof-2",
    login_id: "JDG10002",
    pin: "5678",
    full_name: "Prof. Sunita Sharma (Industry Judge)",
    role: "judge",
  },
  {
    id: "prof-3",
    login_id: "MNR20001",
    pin: "4321",
    full_name: "Arjun Verma (Technical Mentor)",
    role: "mentor",
  },
  {
    id: "prof-4",
    login_id: "MNR20002",
    pin: "8765",
    full_name: "Kavya Rao (Design Mentor)",
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
    team_id: "VV-101",
    team_name: "ByteCrafters",
    domain: "Artificial Intelligence",
    case_study: "Automated Medical Image Triage System for Rural Clinics",
    canva_link: "https://www.canva.com/design/DAFtest1/view",
    drive_link: "https://drive.google.com/drive/folders/1testByteCraftersProto",
    members: [
      { id: "m-1", team_id: "team-1", member_name: "Rahul Sharma", branch: "CSE", is_lead: true },
      { id: "m-2", team_id: "team-1", member_name: "Priya Nair", branch: "AIML", is_lead: false },
      { id: "m-3", team_id: "team-1", member_name: "Karthik Rao", branch: "ISE", is_lead: false },
    ],
  },
  {
    id: "team-2",
    team_id: "VV-102",
    team_name: "NeuroPulse",
    domain: "HealthTech & IoT",
    case_study: "Non-Invasive Glucose Monitoring & Continuous Health Telemetry",
    canva_link: "https://www.canva.com/design/DAFtest2/view",
    drive_link: "https://drive.google.com/drive/folders/1testNeuroPulseProto",
    members: [
      { id: "m-4", team_id: "team-2", member_name: "Sneha Patel", branch: "ECE", is_lead: true },
      { id: "m-5", team_id: "team-2", member_name: "Aditya Joshi", branch: "CSE", is_lead: false },
    ],
  },
  {
    id: "team-3",
    team_id: "VV-103",
    team_name: "BlockShield",
    domain: "Cybersecurity & Web3",
    case_study: "Decentralized Zero-Knowledge Identity Verification for Universities",
    canva_link: "https://www.canva.com/design/DAFtest3/view",
    drive_link: null,
    members: [
      { id: "m-6", team_id: "team-3", member_name: "Vikram Verma", branch: "CyberSecurity", is_lead: true },
      { id: "m-7", team_id: "team-3", member_name: "Ananya Sen", branch: "ISE", is_lead: false },
    ],
  },
  {
    id: "team-4",
    team_id: "VV-104",
    team_name: "EcoSync",
    domain: "CleanTech & Smart Cities",
    case_study: "Smart Urban Waste Bin Telemetry & Fuel-Efficient Route Optimization",
    canva_link: "https://www.canva.com/design/DAFtest4/view",
    drive_link: "https://drive.google.com/drive/folders/1testEcoSyncProto",
    members: [
      { id: "m-8", team_id: "team-4", member_name: "Rohan Kulkarni", branch: "Mechanical / Mechatronics", is_lead: true },
      { id: "m-9", team_id: "team-4", member_name: "Divya Hegde", branch: "CSE", is_lead: false },
    ],
  },
  {
    id: "team-5",
    team_id: "VV-105",
    team_name: "CodeCatalyst",
    domain: "FinTech",
    case_study: "Micro-Credit Scoring and Instant Liquidity Pool for Gig Workers",
    canva_link: "https://www.canva.com/design/DAFtest5/view",
    drive_link: null,
    members: [
      { id: "m-10", team_id: "team-5", member_name: "Tarun Reddy", branch: "ISE", is_lead: true },
      { id: "m-11", team_id: "team-5", member_name: "Meera Menon", branch: "AIML", is_lead: false },
    ],
  },
];

export const MOCK_CRITERIA: EvaluationCriteria[] = [
  {
    id: "crit-1",
    round_id: "round-1",
    criteria_name: "Problem Understanding & Domain Relevance",
    description: "Clarity of the defined problem, relevance of the case study, and depth of initial research.",
    max_marks: 10,
    display_order: 1,
  },
  {
    id: "crit-2",
    round_id: "round-1",
    criteria_name: "Innovation & Technical Architecture",
    description: "Uniqueness of the proposed solution, system design, and software craftsmanship.",
    max_marks: 15,
    display_order: 2,
  },
  {
    id: "crit-3",
    round_id: "round-1",
    criteria_name: "Working Prototype & Implementation Quality",
    description: "Feasibility, completeness of live demonstration, and functional depth of prototype.",
    max_marks: 15,
    display_order: 3,
  },
  {
    id: "crit-4",
    round_id: "round-1",
    criteria_name: "Presentation, Slide Deck & Q&A Response",
    description: "Clarity of Canva presentation, articulation, team synchronization, and answering jury questions.",
    max_marks: 10,
    display_order: 4,
  },
];
