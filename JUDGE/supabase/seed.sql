-- ==================================================================
-- VICEVERSE - SUPABASE SEED DATA (FINAL ROUND)
-- ==================================================================

-- 1. Profiles (Judges and Mentors with PIN credentials)
INSERT INTO public.profiles (id, login_id, pin, name, role, email)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'JDG10001', '1234', 'Dr. Aris Thorne', 'judge', 'aris.thorne@viceverse.internal'),
  ('11111111-1111-1111-1111-111111111112', 'JDG10002', '5678', 'Elena Rostova', 'judge', 'elena.rostova@viceverse.internal'),
  ('22222222-2222-2222-2222-222222222221', 'MNR20001', '4321', 'Prof. Marcus Vance', 'mentor', 'marcus.vance@viceverse.internal'),
  ('22222222-2222-2222-2222-222222222222', 'MNR20002', '8765', 'Kaelen O''Connor', 'mentor', 'kaelen.oc@viceverse.internal')
ON CONFLICT (login_id) DO UPDATE SET
  pin = EXCLUDED.pin,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- 2. Criteria (Final Round 100 Marks Rubric)
INSERT INTO public.criteria (id, name, description, max_marks, sort_order)
VALUES
  ('33333333-3333-3333-3333-333333333331', 'Technical Architecture & Execution', 'Code quality, system stability, modular design, and robust deployment pipelines.', 30, 1),
  ('33333333-3333-3333-3333-333333333332', 'Innovation & Algorithmic Rigor', 'Originality of the approach, depth of algorithmic complexity, and creative problem solving.', 25, 2),
  ('33333333-3333-3333-3333-333333333333', 'Product Viability & Market Impact', 'Product-market fit, real-world utility, commercial feasibility, and scalable business logic.', 25, 3),
  ('33333333-3333-3333-3333-333333333334', 'Presentation & Defense', 'Clarity of the pitch, live demonstration efficacy, and rigorous defense during judge Q&A.', 20, 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  max_marks = EXCLUDED.max_marks,
  sort_order = EXCLUDED.sort_order;

-- 3. Teams (Final Round Dossiers)
INSERT INTO public.teams (id, team_code, name, domain, case_study, canva_url, drive_url, github_url, round_id)
VALUES
  ('44444444-4444-4444-4444-444444444441', 'TM-AI-01', 'NeuralPulse Systems', 'AI & ML', 'Autonomous edge intelligence for zero-latency medical triage in austere remote field units.', 'https://canva.com/design/sample-neuralpulse', 'https://drive.google.com/drive/folders/sample-neuralpulse', 'https://github.com/viceverse-teams/neuralpulse', 'final-round'),
  ('44444444-4444-4444-4444-444444444442', 'TM-CY-02', 'CipherMatrix Protocol', 'Cybersecurity', 'Post-quantum lattice cryptographic key encapsulation for sovereign IoT mesh telemetry.', 'https://canva.com/design/sample-ciphermatrix', 'https://drive.google.com/drive/folders/sample-ciphermatrix', 'https://github.com/viceverse-teams/ciphermatrix', 'final-round'),
  ('44444444-4444-4444-4444-444444444443', 'TM-WB-03', 'Aetherium Network', 'Web3 & Cloud', 'Decentralized zk-rollup verification engine for enterprise multi-party settlement ledgers.', 'https://canva.com/design/sample-aetherium', 'https://drive.google.com/drive/folders/sample-aetherium', 'https://github.com/viceverse-teams/aetherium', 'final-round'),
  ('44444444-4444-4444-4444-444444444444', 'TM-IO-04', 'SynapseGrid Robotics', 'IoT & Robotics', 'Swarm coordination protocol for sub-surface autonomous pipeline anomaly inspection.', 'https://canva.com/design/sample-synapsegrid', 'https://drive.google.com/drive/folders/sample-synapsegrid', 'https://github.com/viceverse-teams/synapsegrid', 'final-round'),
  ('44444444-4444-4444-4444-444444444445', 'TM-HL-05', 'BioSync HealthTech', 'HealthTech', 'Real-time non-invasive biomarker telemetry via localized photonic optical sensor array.', 'https://canva.com/design/sample-biosync', 'https://drive.google.com/drive/folders/sample-biosync', 'https://github.com/viceverse-teams/biosync', 'final-round')
ON CONFLICT (team_code) DO NOTHING;

-- 4. Team Members
INSERT INTO public.team_members (team_id, name, branch, is_lead)
VALUES
  ('44444444-4444-4444-4444-444444444441', 'Aiden Zhao', 'Computer Science & AI', true),
  ('44444444-4444-4444-4444-444444444441', 'Maya Sen', 'Biomedical Engineering', false),
  ('44444444-4444-4444-4444-444444444441', 'Tariq Hassan', 'Electrical Engineering', false),

  ('44444444-4444-4444-4444-444444444442', 'Vikram Malhotra', 'Cyber Defense & Cryptography', true),
  ('44444444-4444-4444-4444-444444444442', 'Chloe Lefevre', 'Information Security', false),

  ('44444444-4444-4444-4444-444444444443', 'Lucas Silva', 'Distributed Systems', true),
  ('44444444-4444-4444-4444-444444444443', 'Zara Lindqvist', 'Financial Mathematics', false),

  ('44444444-4444-4444-4444-444444444444', 'Kenji Sato', 'Mechatronics & Robotics', true),
  ('44444444-4444-4444-4444-444444444444', 'Devin Brooks', 'Embedded Systems', false),

  ('44444444-4444-4444-4444-444444444445', 'Dr. Sarah Jenkins', 'Bio-Photonics', true),
  ('44444444-4444-4444-4444-444444444445', 'Rohan Patel', 'Microfluidics', false);

-- 5. Judge Assignments (Assign all teams to Judge JDG10001)
INSERT INTO public.judge_team_assignments (judge_id, team_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441'),
  ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444442'),
  ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444443'),
  ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444'),
  ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444445')
ON CONFLICT DO NOTHING;
