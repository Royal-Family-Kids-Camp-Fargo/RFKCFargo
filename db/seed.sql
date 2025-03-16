-- Clear existing data (if needed)
TRUNCATE TABLE location, pipeline, pipeline_status, forms, sections, question, 
  multiple_choice_answers, "user", user_pipeline_status, tags, user_tags, 
  user_notes, sms_template CASCADE;

-- Reset sequences
ALTER SEQUENCE location_id_seq RESTART WITH 1;
ALTER SEQUENCE pipeline_id_seq RESTART WITH 1;
ALTER SEQUENCE pipeline_status_id_seq RESTART WITH 1;
ALTER SEQUENCE forms_id_seq RESTART WITH 1;
ALTER SEQUENCE sections_id_seq RESTART WITH 1;
ALTER SEQUENCE question_id_seq RESTART WITH 1;
ALTER SEQUENCE multiple_choice_answers_id_seq RESTART WITH 1;
ALTER SEQUENCE user_id_seq RESTART WITH 1;
ALTER SEQUENCE user_tags_id_seq RESTART WITH 1;
ALTER SEQUENCE user_notes_id_seq RESTART WITH 1;
ALTER SEQUENCE sms_template_id_seq RESTART WITH 1;

-- Seed location table
INSERT INTO location (name) VALUES 
  ('Main Office'),
  ('North Branch'),
  ('South Branch');

-- Seed pipeline table
INSERT INTO pipeline (name, type, location_id) VALUES 
  ('Volunteer', 'volunteer', 1),
  ('Donation', 'donation', 1),
  ('Support', 'support', 2),
  ('Outreach', 'outreach', 3);

-- Seed pipeline_status table
INSERT INTO pipeline_status (pipeline_id, "order", name) VALUES 
  (1, 1, 'New Application'),
  (1, 2, 'Interview Scheduled'),
  (1, 3, 'Onboarding'),
  (1, 4, 'Active'),
  (2, 1, 'Initial Contact'),
  (2, 2, 'Follow-up'),
  (2, 3, 'Committed'),
  (2, 4, 'Recurring Donor'),
  (3, 1, 'Intake'),
  (3, 2, 'Assessment'),
  (3, 3, 'Service Plan'),
  (3, 4, 'Active Support'),
  (4, 1, 'Target Identified'),
  (4, 2, 'Initial Contact'),
  (4, 3, 'Engaged'),
  (4, 4, 'Partnership');

-- Seed forms table
INSERT INTO forms (name, default_pipeline_id, location_id, archived, "locationId", "pipelineId", "defaultPipelineId") VALUES 
  ('Volunteer Application', 1, 1, false, 1, 1, 1),
  ('Donation Form', 2, 1, false, 1, 2, 2),
  ('Support Request', 3, 2, false, 2, 3, 3),
  ('Community Partnership', 4, 3, false, 3, 4, 4);

-- Seed sections table
INSERT INTO sections (name, description, form_id, "order", "formId") VALUES 
  ('Personal Information', 'Basic contact information', 1, 1, 1),
  ('Experience', 'Previous volunteer experience', 1, 2, 1),
  ('Availability', 'When you can volunteer', 1, 3, 1),
  ('Donor Information', 'Your contact details', 2, 1, 2),
  ('Donation Details', 'Amount and frequency', 2, 2, 2),
  ('Client Information', 'Basic client details', 3, 1, 3),
  ('Needs Assessment', 'Areas where support is needed', 3, 2, 3),
  ('Organization Details', 'Information about your organization', 4, 1, 4),
  ('Partnership Goals', 'What you hope to achieve', 4, 2, 4);

-- Seed question table
INSERT INTO question (question, description, answer_type, "order", section_id, archived, required, "sectionId") VALUES 
  ('What is your full name?', 'Please provide your legal name', 'text', 1, 1, false, true, 1),
  ('What is your email address?', 'We will use this to contact you', 'email', 2, 1, false, true, 1),
  ('What is your phone number?', 'Optional contact method', 'phone', 3, 1, false, false, 1),
  ('Have you volunteered before?', 'Previous volunteer experience', 'boolean', 1, 2, false, true, 2),
  ('What skills can you contribute?', 'Select all that apply', 'multiple_choice', 2, 2, false, true, 2),
  ('When are you available?', 'Select all that apply', 'multiple_choice', 1, 3, false, true, 3),
  ('How much would you like to donate?', 'Enter amount in dollars', 'number', 1, 5, false, true, 5),
  ('Would you like to make this a recurring donation?', 'Monthly donations help us plan', 'boolean', 2, 5, false, false, 5),
  ('What services are you interested in?', 'Select all that apply', 'multiple_choice', 1, 7, false, true, 7),
  ('How did you hear about us?', 'This helps us improve our outreach', 'text', 1, 8, false, false, 8);

-- Seed multiple_choice_answers table
INSERT INTO multiple_choice_answers (question_id, answer, "questionId") VALUES 
  (5, 'Administrative', 5),
  (5, 'Event Planning', 5),
  (5, 'Fundraising', 5),
  (5, 'Marketing', 5),
  (5, 'Technical', 5),
  (6, 'Weekday Mornings', 6),
  (6, 'Weekday Afternoons', 6),
  (6, 'Weekday Evenings', 6),
  (6, 'Weekends', 6),
  (9, 'Food Assistance', 9),
  (9, 'Housing Support', 9),
  (9, 'Job Training', 9),
  (9, 'Mental Health Services', 9),
  (9, 'Financial Counseling', 9);

-- Seed user table
INSERT INTO "user" (first_name, last_name, phone_number, email, location_id, city) VALUES 
  ('Admin', 'User', '555-123-4567', 'admin@example.com', 1, 'New York'),
  ('Support', 'Staff', '555-234-5678', 'support@example.com', 2, 'Chicago'),
  ('Volunteer', 'Coordinator', '555-345-6789', 'volunteer@example.com', 1, 'Los Angeles'),
  ('Donor', 'Relations', '555-456-7890', 'donor@example.com', 1, 'Miami'),
  ('Client', 'Services', '555-567-8901', 'client@example.com', 3, 'Seattle');

-- Seed user_pipeline_status table
INSERT INTO user_pipeline_status (user_id, pipeline_status_id, pipeline_id) VALUES 
  (3, 4, 1),  -- Volunteer Coordinator is Active in Volunteer pipeline
  (4, 4, 2),  -- Donor Relations is Recurring Donor in Donation pipeline
  (5, 3, 3);  -- Client Services is in Service Plan stage of Support pipeline

-- Seed tags table
INSERT INTO tags (name) VALUES 
  ('Volunteer'),
  ('Donor'),
  ('Client'),
  ('Partner'),
  ('VIP');

-- Seed user_tags table
INSERT INTO user_tags (user_id, tag_id) VALUES 
  (1, 5),  -- Admin is VIP
  (2, 1),  -- Support Staff is Volunteer
  (3, 1),  -- Volunteer Coordinator is Volunteer
  (4, 2),  -- Donor Relations is Donor
  (5, 3);  -- Client Services is Client

-- Seed user_notes table
INSERT INTO user_notes (note, created_by_id, user_id) VALUES 
  ('Initial onboarding complete', 1, 2),
  ('Completed volunteer training', 1, 3),
  ('Major donor prospect', 4, 4),
  ('Needs follow-up on housing assistance', 2, 5);

-- Seed sms_template table
INSERT INTO sms_template (user_id, is_shared, title, template) VALUES 
  (1, true, 'Welcome Message', 'Welcome to our organization! We''re glad to have you with us.'),
  (1, true, 'Appointment Reminder', 'Reminder: You have an appointment scheduled for {{date}} at {{time}}.'),
  (2, false, 'Follow-up', 'Thank you for meeting with us today. Please let us know if you have any questions.'),
  (3, true, 'Volunteer Opportunity', 'New volunteer opportunity available: {{opportunity}}. Please respond if interested.');

-- Seed submission table (if needed)
-- INSERT INTO submission (user_id, form_id, finished_at, "userId", "formId") VALUES 
--   (3, 1, NOW(), 3, 1),
--   (4, 2, NOW(), 4, 2),
--   (5, 3, NOW(), 5, 3);

-- Seed answer table (if needed)
-- INSERT INTO answer (question_id, submission_id, user_id, answer, "questionId", "userId", "submissionId") VALUES 
--   (1, 1, 3, 'John Doe', 1, 3, 1),
--   (2, 1, 3, 'john@example.com', 2, 3, 1),
--   (7, 2, 4, '100', 7, 4, 2),
--   (8, 2, 4, 'true', 8, 4, 2),
--   (9, 3, 5, 'Housing Support', 9, 5, 3);

-- Seed donation table (if needed)
-- INSERT INTO donation (user_id, amount, "userId") VALUES 
--   (4, 100, 4),
--   (4, 150, 4);