-- database name: rfkc
-- 13 tables

CREATE TABLE "user" (
"id" SERIAL PRIMARY KEY,
"username" VARCHAR (150) NOT NULL unique,
"password" VARCHAR (1000) NOT NULL,
"first_name" VARCHAR (35),
"last_name" VARCHAR(30),
"phone_number" VARCHAR(15),
"created_at" timestamp default (now() at time zone 'utc'),
"updated_at" timestamp default (now() at time zone 'utc')
);

CREATE TABLE "location" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR (255) NOT NULL
);

CREATE TABLE "user_location" (
	"user_id" INT references "user" on delete cascade,
	"location_id" INT references "location" on delete cascade,
 	"internal" BOOLEAN default 'false'
);
ALTER TABLE "user_location"
ADD CONSTRAINT unique_user_location UNIQUE (user_id, location_id);


CREATE TABLE "donation" (
"id" SERIAL PRIMARY KEY,
"user_id" INT references "user",
"amount" INT,
"created_at" timestamp default (now() at time zone 'utc'),
"updated_at" timestamp default (now() at time zone 'utc')
);

CREATE TABLE "pipeline" (
"id" SERIAL PRIMARY KEY,
"name" VARCHAR(32),
"type" VARCHAR(20),
"location_id" INTEGER REFERENCES "location" NOT NULL
);

CREATE TABLE "pipeline_status" (
"id" SERIAL PRIMARY KEY,
"pipeline_id" INT references "pipeline" on delete cascade,
"order" int not null,
"name" VARCHAR (150)
);

CREATE TABLE "user_status" (
"user_id" INT references "user" on delete cascade,
"pipeline_status_id" INT references "pipeline_status" on delete cascade
);
-- Alter table to put unique constraint on key to prevent duplicate pairings
ALTER TABLE "user_status"
ADD CONSTRAINT unique_user_pipeline_status UNIQUE (user_id, pipeline_status_id);

CREATE TABLE "forms" (
"id" SERIAL PRIMARY KEY,
"name" VARCHAR (150),
"default_pipeline_id" INTEGER REFERENCES "pipeline" NOT NULL,
"location_id" INTEGER REFERENCES "location" NOT NULL,
"archived" BOOLEAN default 'false' NOT NULL
);

CREATE TABLE "submission" (
"id" SERIAL PRIMARY KEY,
"user_id" INT references "user",
"form_id" INT references "forms",
"started_at" timestamp default (now() at time zone 'utc'),
"finished_at" timestamp
);

CREATE TABLE "sections"(
"id" SERIAL PRIMARY KEY,
"name" VARCHAR (150) not null,
"description" varchar(500) default '',
"form_id" INT references "forms" on delete cascade,
"order" INT not null
);

CREATE TABLE "question"(
"id" SERIAL PRIMARY KEY,
"question" VARCHAR (500),
"description" VARCHAR (500),
"answer_type" VARCHAR (30),
"order" INT not null,
"section_id" INT references "sections", 
"archived" BOOLEAN default 'false',
"required" boolean DEFAULT 'false',
"created_at" timestamp default (now() at time zone 'utc'),
"updated_at" timestamp default (now() at time zone 'utc')
);

CREATE TABLE "answer" (
"id" SERIAL PRIMARY KEY,
"question_id" INT references "question",
"submission_id" INT references "submission" on delete cascade,
"user_id" INT references "user",
"answer" VARCHAR(1000),
"created_at" timestamp default (now() at time zone 'utc'),
"updated_at" timestamp default (now() at time zone 'utc')
);

CREATE TABLE "multiple_choice_answers" (
"id" SERIAL PRIMARY KEY,
"question_id" INT references "question" on delete cascade,
"answer" VARCHAR (1000)
);

--------------------------------
--------------------------------
--------SEED DATA BEGINS--------
--------------------------------
--------------------------------

-- Seed data for locations
INSERT INTO "location" ("id", "name") VALUES
(1, 'Fargo'),
(2, 'Moorhead'),
(3, 'Sioux Falls');

	-- Seed data for pipeline table 
	INSERT INTO "pipeline" (id, name, type, location_id) VALUES
	(1, 'Volunteer-Fargo', 'volunteer', 1),
	(3, 'Donor-Fargo', 'donor', 1),


	-- Seed data for pipeline_status table 
	INSERT INTO "pipeline_status" (id, pipeline_id, "order", name) VALUES
	(2, 1, 1, 'Application submitted'),
	(3, 1, 2, 'Application Review'),
	(4, 1, 3, 'Interview'),
	(5, 1, 4, 'Background Check'),
	(6, 1, 5, 'Verified/Accepted'),
	(7, 3, 1, 'Interested'),
	(8, 3, 2, 'Discussed'),
	(9, 3, 3, 'Check sent'),
	(10, 3, 4, 'Check verified'),
	(11, 3, 5, 'Donated'),
	

-- Seed data, needs to be updated to be correct (these arent the actual questions)
-- Seed data for form
INSERT INTO "forms" ("name", "location_id", "default_pipeline_id") VALUES
('Fargo New Volunteer Form', 2, 1);

-- Seed data for sections
INSERT INTO "sections" ("name", "description", "form_id", "order") VALUES
('Personal Information', 'Basic details about the applicant', (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'), 1),
('Volunteer Experience', 'Details about past volunteering work', (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'), 2),
('Availability', 'Check your availability for volunteering', (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'), 3),
('Skills and Preferences', 'Specific skills and preferences related to volunteering', (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'), 4);


-- Seed data for questions
INSERT INTO "question" ("question", "description", "answer_type", "order", "section_id", "required") VALUES
-- Section 1: Personal Information
('What is your full name?', 'Please enter your first and last name.', 'text', 1, (SELECT id FROM "sections" WHERE "name" = 'Personal Information' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), TRUE),
('What is your date of birth?', 'Enter in the format YYYY-MM-DD.', 'text', 2, (SELECT id FROM "sections" WHERE "name" = 'Personal Information' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), TRUE),
('What is your email address?', 'This will be used to contact you.', 'text', 3, (SELECT id FROM "sections" WHERE "name" = 'Personal Information' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), TRUE),
('What is your phone number?', 'Include country code if applicable.', 'text', 4, (SELECT id FROM "sections" WHERE "name" = 'Personal Information' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), TRUE),
('Do you have any dietary restrictions?', 'Specify if applicable.', 'multiple_choice', 5, (SELECT id FROM "sections" WHERE "name" = 'Personal Information' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), TRUE),

-- Section 2: Volunteer Experience
('Have you volunteered with us before?', 'Provide details if applicable.', 'text', 1, (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), TRUE),
('How many years of volunteer experience do you have?', 'Specify in number of years.', 'text', 2, (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), TRUE),
('What type of volunteering have you done before?', 'List relevant types.', 'text', 3, (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), TRUE),
('Why are you interested in volunteering?', 'Briefly describe your motivation.', 'text', 4, (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), TRUE),
('What is your preferred volunteering activity?', 'Select one or more.', 'multiple_choice', 5, (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), TRUE),

-- Section 3: Availability
('What days of the week are you available?', 'Select all that apply.', 'multiple_choice', 1, (SELECT id FROM "sections" WHERE "name" = 'Availability' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), FALSE),
('What time of the day works best for you?', 'Choose from the options.', 'multiple_choice', 2, (SELECT id FROM "sections" WHERE "name" = 'Availability' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), FALSE),
('How many hours can you commit each week?', 'Provide a rough estimate.', 'text', 3, (SELECT id FROM "sections" WHERE "name" = 'Availability' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), FALSE),
('Are you open to on-call volunteering?', 'Yes or No.', 'dropdown', 4, (SELECT id FROM "sections" WHERE "name" = 'Availability' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), FALSE),
('Do you have any upcoming commitments we should be aware of?', 'Provide details.', 'text', 5, (SELECT id FROM "sections" WHERE "name" = 'Availability' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), FALSE),

-- Section 4: Skills and Preferences
('What skills do you bring to volunteering?', 'List relevant skills.', 'text', 1, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), FALSE),
('Do you prefer working with children or adults?', 'Choose one.', 'multiple_choice', 2, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), FALSE),
('Are you comfortable leading activities?', 'Yes or No.', 'multiple_choice', 3, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), FALSE),
('Do you have any certifications related to volunteering?', 'Specify if applicable.', 'text', 4, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), FALSE),
('What type of environment do you prefer?', 'Select one.', 'multiple_choice', 5, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')), FALSE);

-- Seed data for multiple_choice_answers
INSERT INTO "multiple_choice_answers" ("question_id", "answer") VALUES
-- Dietary restrictions
(5, 'None'),
(5, 'Vegetarian'),
(5, 'Vegan'),
(5, 'Gluten-Free'),
(5, 'Other'),

-- Preferred volunteering activity
(10, 'Event Planning'),
(10, 'Fundraising'),
(10, 'Mentoring'),
(10, 'Administrative Support'),

-- Days of the week
(11, 'Monday'),
(11, 'Tuesday'),
(11, 'Wednesday'),
(11, 'Thursday'),
(11, 'Friday'),
(11, 'Saturday'),
(11, 'Sunday'),

-- Time of day
(12, 'Morning'),
(12, 'Afternoon'),
(12, 'Evening'),

-- On-call volunteering
(14, 'Yes'),
(14, 'No'),

-- Work with children or adults
(17, 'Children'),
(17, 'Adults'),

-- Comfortable leading activities
(18, 'Yes'),
(18, 'No'),

-- Preferred environment
(20, 'Outdoor'),
(20, 'Indoor'),
(20, 'Flexible');


    -- Seed data for use table 
	INSERT INTO "user" (id, username, password, first_name, last_name, created_at, updated_at, phone_number) VALUES
    (1, 'Jase@email.com', '$2a$10$H8GXZ2rxhn0hfSw4AkL4UOgj0eOEIXBL9voNACAyf4LPD1UDLG29C', 'Jase', 'AwesomeFace', '2024-11-13 17:30:59.27662', '2024-11-13 17:30:59.27662', '5554446666'),
    (2, 'John@email.com', '$2a$10$aI5qmttW.229Cjw0tC4Lj.NafXJb6eef8FQPuEPY265e1wnA28MG.', 'John', 'Johnson', '2024-11-13 20:53:08.527638', '2024-11-13 20:53:08.527638', '5554446666');

 -- Seed data for user_location table 
	INSERT INTO "user_location" (user_id, location_id, internal) VALUES
	(1, 1, TRUE),
	(1, 2, TRUE),
	(1, 3, TRUE),
	(2, 1, FALSE);


-- Reset primary key sequences for all tables (since we set primary keys in seed data manually)
SELECT setval(pg_get_serial_sequence('user', 'id'), (SELECT MAX(id) FROM "user"));
SELECT setval(pg_get_serial_sequence('location', 'id'), (SELECT MAX(id) FROM "location"));
SELECT setval(pg_get_serial_sequence('donation', 'id'), (SELECT MAX(id) FROM "donation"));
SELECT setval(pg_get_serial_sequence('pipeline', 'id'), (SELECT MAX(id) FROM "pipeline"));
SELECT setval(pg_get_serial_sequence('pipeline_status', 'id'), (SELECT MAX(id) FROM "pipeline_status"));
SELECT setval(pg_get_serial_sequence('forms', 'id'), (SELECT MAX(id) FROM "forms"));
SELECT setval(pg_get_serial_sequence('submission', 'id'), (SELECT MAX(id) FROM "submission"));
SELECT setval(pg_get_serial_sequence('sections', 'id'), (SELECT MAX(id) FROM "sections"));
SELECT setval(pg_get_serial_sequence('question', 'id'), (SELECT MAX(id) FROM "question"));
SELECT setval(pg_get_serial_sequence('answer', 'id'), (SELECT MAX(id) FROM "answer"));
SELECT setval(pg_get_serial_sequence('multiple_choice_answers', 'id'), (SELECT MAX(id) FROM "multiple_choice_answers"));

-- Create extension for pg_trgm
-- ONLY RUN ONCE
CREATE EXTENSION if not exists pg_trgm;