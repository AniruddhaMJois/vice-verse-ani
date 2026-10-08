-- ==============================================================================
-- VICEVERSE: SEED DATA FOR SINGLE JUDGING ROUND, TEAMS, CRITERIA & USERS
-- ==============================================================================

-- 1. Seed Judges and Mentors
INSERT INTO public.profiles (login_id, pin, full_name, role) VALUES
('JDG10001', '1234', 'Dr. Rajesh Kumar (AI Judge)', 'judge'),
('JDG10002', '5678', 'Prof. Sunita Sharma (Industry Judge)', 'judge'),
('MNR20001', '4321', 'Arjun Verma (Technical Mentor)', 'mentor'),
('MNR20002', '8765', 'Kavya Rao (Design Mentor)', 'mentor')
ON CONFLICT (login_id) DO NOTHING;

-- 2. Seed Single Official Judging Round
INSERT INTO public.rounds (round_number, round_name, description, is_active) VALUES
(1, 'Grand Hackathon Evaluation Round', 'Official comprehensive evaluation of problem understanding, technical feasibility, prototype demo, and presentation.', true)
ON CONFLICT (round_number) DO NOTHING;

-- 3. Seed Teams
INSERT INTO public.teams (team_id, team_name, domain, case_study, canva_link, drive_link) VALUES
('VV-101', 'ByteCrafters', 'Artificial Intelligence', 'Automated Medical Image Triage System', 'https://www.canva.com/design/example1', 'https://drive.google.com/drive/folders/example1'),
('VV-102', 'NeuroPulse', 'HealthTech', 'Non-Invasive Glucose Monitoring Platform', 'https://www.canva.com/design/example2', 'https://drive.google.com/drive/folders/example2'),
('VV-103', 'BlockShield', 'Cybersecurity & Web3', 'Decentralized Identity Verification for Universities', 'https://www.canva.com/design/example3', NULL),
('VV-104', 'EcoSync', 'CleanTech / IoT', 'Smart Urban Waste Management with Route Optimization', 'https://www.canva.com/design/example4', 'https://drive.google.com/drive/folders/example4'),
('VV-105', 'CodeCatalyst', 'FinTech', 'Micro-Lending Protocol for Gig Workers', 'https://www.canva.com/design/example5', NULL)
ON CONFLICT (team_id) DO NOTHING;

-- 4. Seed Team Members
INSERT INTO public.team_members (team_id, member_name, branch, is_lead)
SELECT id, 'Rahul Sharma', 'CSE', true FROM public.teams WHERE team_id = 'VV-101'
UNION ALL
SELECT id, 'Priya Nair', 'AIML', false FROM public.teams WHERE team_id = 'VV-101'
UNION ALL
SELECT id, 'Karthik Rao', 'ISE', false FROM public.teams WHERE team_id = 'VV-101'
UNION ALL
SELECT id, 'Sneha Patel', 'ECE', true FROM public.teams WHERE team_id = 'VV-102'
UNION ALL
SELECT id, 'Aditya Joshi', 'CSE', false FROM public.teams WHERE team_id = 'VV-102'
UNION ALL
SELECT id, 'Vikram Verma', 'CyberSecurity', true FROM public.teams WHERE team_id = 'VV-103'
UNION ALL
SELECT id, 'Ananya Sen', 'ISE', false FROM public.teams WHERE team_id = 'VV-103';

-- 5. Map Teams to the Single Judging Round
INSERT INTO public.round_teams (round_id, team_id)
SELECT r.id, t.id
FROM public.rounds r, public.teams t
WHERE r.round_number = 1
ON CONFLICT (round_id, team_id) DO NOTHING;

-- 6. Seed Evaluation Criteria for the Single Judging Round
INSERT INTO public.evaluation_criteria (round_id, criteria_name, description, max_marks, display_order)
SELECT r.id, 'Problem Understanding & Relevance', 'Clarity of the defined issue and target audience', 10, 1
FROM public.rounds r WHERE r.round_number = 1
UNION ALL
SELECT r.id, 'Innovation & Originality', 'Uniqueness and differentiation of the proposed solution', 15, 2
FROM public.rounds r WHERE r.round_number = 1
UNION ALL
SELECT r.id, 'Feasibility & Technical Approach', 'Soundness of technical architecture and tools used', 15, 3
FROM public.rounds r WHERE r.round_number = 1
UNION ALL
SELECT r.id, 'Presentation & Q&A', 'Delivery, slide clarity (Canva link), and answer confidence', 10, 4
FROM public.rounds r WHERE r.round_number = 1;
