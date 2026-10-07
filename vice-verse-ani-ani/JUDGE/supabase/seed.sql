-- ==================================================================
-- VICEVERSE - SUPABASE SEED DATA (FINAL ROUND)
-- ==================================================================

-- 1. Profiles
INSERT INTO public.profiles (id, login_id, name, role, email)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'JDG10001', 'Dr. Aris Thorne', 'judge', 'aris.thorne@viceverse.internal'),
  ('a0000000-0000-0000-0000-000000000002', 'JDG10002', 'Elena Rostova', 'judge', 'elena.rostova@viceverse.internal'),
  ('b0000000-0000-0000-0000-000000000001', 'MNR20001', 'Prof. Marcus Vance', 'mentor', 'marcus.vance@viceverse.internal'),
  ('b0000000-0000-0000-0000-000000000002', 'MNR20002', 'Kaelen O''Connor', 'mentor', 'kaelen.oc@viceverse.internal')
ON CONFLICT (login_id) DO NOTHING;

-- 2. Criteria (Final Round 100 Marks Rubric)
INSERT INTO public.criteria (id, name, description, max_marks, sort_order)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Technical Architecture & Execution', 'Code quality, system stability, modular design, and robust deployment pipelines.', 30, 1),
  ('c0000000-0000-0000-0000-000000000002', 'Innovation & Algorithmic Rigor', 'Originality of the approach, depth of algorithmic complexity, and creative problem solving.', 25, 2),
  ('c0000000-0000-0000-0000-000000000003', 'Product Viability & Market Impact', 'Product-market fit, real-world utility, commercial feasibility, and scalable business logic.', 25, 3),
  ('c0000000-0000-0000-0000-000000000004', 'Presentation & Defense', 'Clarity of the pitch, live demonstration efficacy, and rigorous defense during judge Q&A.', 20, 4)
ON CONFLICT (id) DO NOTHING;

-- 3. Teams (Final Round Dossiers)
INSERT INTO public.teams (id, team_code, name, domain, case_study, canva_url, drive_url, github_url, round_id)
VALUES
  ('t0000000-0000-0000-0000-000000000001', 'TM-AI-01', 'NeuralPulse Systems', 'AI & ML', 'Autonomous edge intelligence for zero-latency medical triage in austere remote field units.', 'https://canva.com/design/sample-neuralpulse', 'https://drive.google.com/drive/folders/sample-neuralpulse', 'https://github.com/viceverse-teams/neuralpulse', 'final-round'),
  ('t0000000-0000-0000-0000-000000000002', 'TM-CY-02', 'CipherMatrix Protocol', 'Cybersecurity', 'Post-quantum lattice cryptographic key encapsulation for sovereign IoT mesh telemetry.', 'https://canva.com/design/sample-ciphermatrix', 'https://drive.google.com/drive/folders/sample-ciphermatrix', 'https://github.com/viceverse-teams/ciphermatrix', 'final-round'),
  ('t0000000-0000-0000-0000-000000000003', 'TM-WB-03', 'Aetherium Network', 'Web3 & Cloud', 'Decentralized zk-rollup verification engine for enterprise multi-party settlement ledgers.', 'https://canva.com/design/sample-aetherium', 'https://drive.google.com/drive/folders/sample-aetherium', 'https://github.com/viceverse-teams/aetherium', 'final-round'),
  ('t0000000-0000-0000-0000-000000000004', 'TM-IO-04', 'SynapseGrid Robotics', 'IoT & Robotics', 'Swarm coordination protocol for sub-surface autonomous pipeline anomaly inspection.', 'https://canva.com/design/sample-synapsegrid', 'https://drive.google.com/drive/folders/sample-synapsegrid', 'https://github.com/viceverse-teams/synapsegrid', 'final-round'),
  ('t0000000-0000-0000-0000-000000000005', 'TM-HL-05', 'BioSync HealthTech', 'HealthTech', 'Real-time non-invasive biomarker telemetry via localized photonic optical sensor array.', 'https://canva.com/design/sample-biosync', 'https://drive.google.com/drive/folders/sample-biosync', 'https://github.com/viceverse-teams/biosync', 'final-round')
ON CONFLICT (team_code) DO NOTHING;

-- 4. Team Members
INSERT INTO public.team_members (team_id, name, branch, is_lead)
VALUES
  ('t0000000-0000-0000-0000-000000000001', 'Aiden Zhao', 'Computer Science & AI', true),
  ('t0000000-0000-0000-0000-000000000001', 'Maya Sen', 'Biomedical Engineering', false),
  ('t0000000-0000-0000-0000-000000000001', 'Tariq Hassan', 'Electrical Engineering', false),

  ('t0000000-0000-0000-0000-000000000002', 'Vikram Malhotra', 'Cyber Defense & Cryptography', true),
  ('t0000000-0000-0000-0000-000000000002', 'Chloe Lefevre', 'Information Security', false),

  ('t0000000-0000-0000-0000-000000000003', 'Lucas Silva', 'Distributed Systems', true),
  ('t0000000-0000-0000-0000-000000000003', 'Zara Lindqvist', 'Financial Mathematics', false),

  ('t0000000-0000-0000-0000-000000000004', 'Kenji Sato', 'Mechatronics & Robotics', true),
  ('t0000000-0000-0000-0000-000000000004', 'Devin Brooks', 'Embedded Systems', false),

  ('t0000000-0000-0000-0000-000000000005', 'Dr. Sarah Jenkins', 'Bio-Photonics', true),
  ('t0000000-0000-0000-0000-000000000005', 'Rohan Patel', 'Microfluidics', false);

-- 5. Judge Assignments (Assign teams 1, 2, 3, 4, 5 to Judge 1)
INSERT INTO public.judge_team_assignments (judge_id, team_id)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000003', 't0000000-0000-0000-0000-000000000003'),
  ('a0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000004'),
  ('a0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000005')
ON CONFLICT DO NOTHING;
