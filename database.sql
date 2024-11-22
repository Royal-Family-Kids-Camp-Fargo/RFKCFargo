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
INSERT INTO "question" ("question", "description", "answer_type", "order", "section_id") VALUES
-- Section 1: Personal Information
('What is your full name?', 'Please enter your first and last name.', 'text', 1, (SELECT id FROM "sections" WHERE "name" = 'Personal Information' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('What is your date of birth?', 'Enter in the format YYYY-MM-DD.', 'text', 2, (SELECT id FROM "sections" WHERE "name" = 'Personal Information' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('What is your email address?', 'This will be used to contact you.', 'text', 3, (SELECT id FROM "sections" WHERE "name" = 'Personal Information' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('What is your phone number?', 'Include country code if applicable.', 'text', 4, (SELECT id FROM "sections" WHERE "name" = 'Personal Information' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('Do you have any dietary restrictions?', 'Specify if applicable.', 'multiple_choice', 5, (SELECT id FROM "sections" WHERE "name" = 'Personal Information' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),

-- Section 2: Volunteer Experience
('Have you volunteered with us before?', 'Provide details if applicable.', 'text', 1, (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('How many years of volunteer experience do you have?', 'Specify in number of years.', 'text', 2, (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('What type of volunteering have you done before?', 'List relevant types.', 'text', 3, (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('Why are you interested in volunteering?', 'Briefly describe your motivation.', 'text', 4, (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('What is your preferred volunteering activity?', 'Select one or more.', 'multiple_choice', 5, (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),

-- Section 3: Availability
('What days of the week are you available?', 'Select all that apply.', 'multiple_choice', 1, (SELECT id FROM "sections" WHERE "name" = 'Availability' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('What time of the day works best for you?', 'Choose from the options.', 'multiple_choice', 2, (SELECT id FROM "sections" WHERE "name" = 'Availability' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('How many hours can you commit each week?', 'Provide a rough estimate.', 'text', 3, (SELECT id FROM "sections" WHERE "name" = 'Availability' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('Are you open to on-call volunteering?', 'Yes or No.', 'multiple_choice', 4, (SELECT id FROM "sections" WHERE "name" = 'Availability' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('Do you have any upcoming commitments we should be aware of?', 'Provide details.', 'text', 5, (SELECT id FROM "sections" WHERE "name" = 'Availability' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),

-- Section 4: Skills and Preferences
('What skills do you bring to volunteering?', 'List relevant skills.', 'text', 1, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('Do you prefer working with children or adults?', 'Choose one.', 'multiple_choice', 2, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('Are you comfortable leading activities?', 'Yes or No.', 'multiple_choice', 3, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('Do you have any certifications related to volunteering?', 'Specify if applicable.', 'text', 4, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form'))),
('What type of environment do you prefer?', 'Select one.', 'multiple_choice', 5, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences' AND form_id = (SELECT id FROM "forms" WHERE "name" = 'Fargo New Volunteer Form')));

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

-- username: test, password: password
INSERT INTO "user" ("username","password","first_name","last_name","phone_number","created_at","updated_at")
VALUES
(E'test',E'$2a$10$yA4FmJp4bIGGFL.h9yQ1BOCIfrNForINAgDU9TdF/gzlmBJ7ZCvoO',E'jane',E'doe',NULL,E'2024-11-20 17:46:32.806801',E'2024-11-20 17:46:32.806801');

INSERT INTO "submission" ("user_id", "form_id", "started_at", "finished_at")
VALUES
    (1, 1, NOW(), NOW());

INSERT INTO "answer" ("question_id", "submission_id", "user_id", "answer", "created_at", "updated_at")
VALUES
    -- Section 1: Personal Information
    (1, 1, 1, 'John Doe', NOW(), NOW()), 
    (2, 1, 1, 'johndoe@example.com', NOW(), NOW()),
    (3, 1, 1, '555-123-4567', NOW(), NOW()),
    (4, 1, 1, 'I heard about this program through a friend.', NOW(), NOW()),
    (5, 1, 1, 'No allergies.', NOW(), NOW()),

    -- Section 2: Volunteer Experience
    (6, 1, 1, 'Yes', NOW(), NOW()),
    (7, 1, 1, 'Camp counselor, Logistics assistant', NOW(), NOW()),
    (8, 1, 1, 'Yes, I worked as a teacher for 3 years.', NOW(), NOW()),
    (9, 1, 1, 'Yes, I completed a safeguarding course.', NOW(), NOW()),
    (10, 1, 1, 'I want to make a positive impact in the lives of children.', NOW(), NOW()),

    -- Section 3: Availability
    (11, 1, 1, 'Monday, Wednesday, Saturday', NOW(), NOW()),
    (12, 1, 1, 'Yes', NOW(), NOW()),
    (13, 1, 1, 'Evenings', NOW(), NOW()),
    (14, 1, 1, 'Yes', NOW(), NOW()),
    (15, 1, 1, 'Immediately', NOW(), NOW()),

    -- Section 4: Skills and Preferences
    (16, 1, 1, 'Team leadership, Conflict resolution, First aid', NOW(), NOW()),
    (17, 1, 1, 'Organizing activities, Mentoring, Logistics', NOW(), NOW()),
    (18, 1, 1, 'Yes', NOW(), NOW()),
    (19, 1, 1, 'No', NOW(), NOW()),
    (20, 1, 1, 'Outdoors', NOW(), NOW());

    -- Seed data for use table 
	INSERT INTO "user" (id, username, password, first_name, last_name, created_at, updated_at, phone_number) VALUES
    (2, 'Jenny@email.com', '$2a$10$H8GXZ2rxhn0hfSw4AkL4UOgj0eOEIXBL9voNACAyf4LPD1UDLG29C', 'Jenny', 'Lagervall', '2024-11-13 17:30:59.27662', '2024-11-13 17:30:59.27662', '5554446666'),
    (3, 'John@email.com', '$2a$10$aI5qmttW.229Cjw0tC4Lj.NafXJb6eef8FQPuEPY265e1wnA28MG.', 'John', 'Johnson', '2024-11-13 20:53:08.527638', '2024-11-13 20:53:08.527638', '5554446666'),
	(4, 'Jane@email.com', '$2a$10$nTK10uKgnnds5dEfw32q6utqrnuPCTHoqVsH96WONZz4oQjGpIqxW', 'Jane', 'Doe', '2024-11-16 17:06:16.940875', '2024-11-16 17:06:16.940875', '5554446666'),
	(5, 'Bobby@email.com', '$2a$10$1jFipmwYGaT8PREfICcaL.mH2.1e1c6gj86zWZv8cPNE06rnBO9iW', 'Bobby', 'DropTable', '2024-11-16 17:06:43.238385', '2024-11-16 17:06:43.238385', '5554446666'),
	(6, 'Jill@email.com', '$2a$10$FtfWTKMFzWtAGNqqux8JR.JDJZAXPyowhReDMLKaTWwg3.HYfeLZu', 'Jill', 'JillLastname', '2024-11-16 17:38:17.819879', '2024-11-16 17:38:17.819879', '5554446666'),
	(7, 'Jack@email.com', '$2a$10$oKFMocpP26/1I4Ugw.n4eOqvMa8cty9vJy31T5fwP6YJczk1n0gda', 'Jack', 'JackLastname', '2024-11-16 17:38:31.094039', '2024-11-16 17:38:31.094039', '5554446666'),
	(8, 'Bennie@email.com', '$2a$10$jSgojv37i3B/eEsEB3IZn.UrhMMn2V5Qh25uC4NKbgkB9lIBR.7Le', 'Bennie', 'Andthejets', '2024-11-16 21:38:32.019924', '2024-11-16 21:38:32.019924', '5554446666'),
	(9, 'Roxanne@email.com', '$2a$10$nhTrhkygHNFQC/Y7FMa0m.9NR1rbmWUC3LfXVYDuyYmiZBD0SRHJe', 'Roxanne', 'Redlights', '2024-11-16 21:39:02.479261', '2024-11-16 21:39:02.479261', '5554446666'),
	(10, 'Robert@email.com', '$2a$10$YhMCJlcUhDpQWVes6GvpLekzb0rqORBqD2RZ59DeSGF2jTXjOfzWq', 'Robert', 'Dylan', '2024-11-16 21:39:28.678322', '2024-11-16 21:39:28.678322', '5554446666'),
	(11, 'James@email.com', '$2a$10$U8fnyT7pXUUkH2M6ctSYxOzbxvYHHpHp8QY3JdKQmaxm3Ffqnahi6', 'James', 'Hendrix', '2024-11-16 21:39:47.148731', '2024-11-16 21:39:47.148731', '5554446666'),
	(12, 'Dave@email.com', '$2a$10$AP6i.RQ9P.oTaSCWgbpzku4oI8WT/UfvCHkDlS4.mpYGTcPVaPejm', 'Dave', 'Davidson', '2024-11-18 15:57:37.139603', '2024-11-18 15:57:37.139603', '5554446666'),
	(13, 'Sixton@email.com', '$2a$10$WNoQmHJPXMu9ATEiwevC8urXb75WxSXJMvCpIE4rBBj7N9VwHpHRa', 'Sixton', 'Lagervall', '2024-11-19 16:41:53.556703', '2024-11-19 16:41:53.556703', '5554446666'),
	(14, 'Jimi@email.com', '$2a$10$5Ky1o8ESWkxqIL.ZJWkjaukIc1nck6PRb0KyX/BXUxCIQKJKOOHvq', 'Jimi', 'Hendrix', '2024-11-19 16:42:25.351542', '2024-11-19 16:42:25.351542', '5554446666'),
	(15, 'Katie@email.com', '$2a$10$0LwMj3bbbXWDAY3lFv6w1OKQk8XQrOKYOcUVLshmtc6h1kc2RkA46', 'Katie', 'EDA', '2024-11-19 16:43:00.849151', '2024-11-19 16:43:00.849151', '5554446666'),
	(16, 'Aimee@email.com', '$2a$10$.SRrmd.7YqRvr5N3GHIXNOQ9XvqYN5UsuxYuVoep0LP.QTxn8z2J2', 'Aimee', 'Larson', '2024-11-19 16:43:36.034627', '2024-11-19 16:43:36.034627', '5554446666'),
	(17, 'Nana@email.com', '$2a$10$HJdJaJsvB/ay5ctL/oKcI.xn6r8oUbc2vbYOMsHCo2Ng1d9IRObJq', 'Nane', 'Tucket', '2024-11-19 16:44:04.615592', '2024-11-19 16:44:04.615592', '5554446666'),
	(18, 'Dakota@email.com', '$2a$10$bfxuX8E1RK81hXBb725VmOIczoUMV6Pl2neoF6nzGrpXcz//wKRD2', 'Dakota', 'South', '2024-11-19 16:44:40.868682', '2024-11-19 16:44:40.868682', '5554446666'),
	(19, 'Sara@email.com', '$2a$10$dGThAXImwP/oLx9gUhy3VuDNxEJKdWTUcEPvHeh4QVd1KiZcQfrUO', 'Sara', 'Stevens', '2024-11-19 16:45:50.937091', '2024-11-19 16:45:50.937091', '5554446666'),
	(20, 'Allison@email.com', '$2a$10$cUboRN/lITEXnUjqngJqUuVCYN3QoD2QeYlXvsGMf1rojU9sJ0WAq', 'Allison', 'Mae', '2024-11-19 23:03:18.662008', '2024-11-19 23:03:18.662008', '9998887777');

 -- Seed data for user_location table 
	INSERT INTO "user_location" (user_id, location_id, internal) VALUES
	(2, 1, TRUE),
	(2, 2, TRUE),
	(2, 3, TRUE),
	(3, 1, FALSE),
	(4, 1, FALSE),
	(5, 1, FALSE),
	(6, 1, FALSE),
	(7, 2, FALSE),
	(8, 2, FALSE),
	(9, 2, FALSE),
	(10, 2, FALSE),
	(11, 2, FALSE),
	(12, 1, FALSE),
	(13, 1, FALSE),
	(14, 1, FALSE),
	(15, 1, FALSE),
	(16, 2, FALSE),
	(17, 2, FALSE),
	(18, 2, FALSE),
	(19, 2, FALSE),
	(20, 2, FALSE);

	-- Seed data for pipeline table 
	INSERT INTO "pipeline" (id, name, type, location_id) VALUES
	(1, 'Volunteer_fargo', 'volunteer', 1),
	(3, 'Donor_fargo', 'donor', 1),
	(4, 'Newpipeline', 'volunteer', 1),
	(6, 'Volunteer- Sioux Fall', 'volunteer', 3),
	(7, 'Donor- Sioux Falls', 'donor', 3),
	(8, 'Volunteer- Moorhead', 'volunteer', 2),
	(13, 'Volunteer- Fargo', 'volunteer', 1);

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
	(12, 8, 1, 'application submitted'),
	(13, 8, 3, 'interview'),
	(14, 8, 2, 'application review'),
	(15, 8, 4, 'background check'),
	(16, 8, 5, 'verified/accepted'),
	(22, 13, 1, 'application submitted'),
	(23, 13, 3, 'interview'),
	(24, 13, 5, 'verified/accepted'),
	(25, 13, 2, 'application review'),
	(26, 13, 4, 'background check');

	 -- Seed data for user_status table 
	 INSERT INTO "user_status" (user_id, pipeline_status_id) VALUES
	(2, 2),
	(3, 6),
	(4, 2),
	(5, 4),
	(6, 4),
	(7, 8),
	(8, 8),
	(9, 9),
	(10, 9),
	(11, 8),
	(12, 4),
	(13, 4),
	(14, 5),
	(20, 26);


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
