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
"type" VARCHAR(20)
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

CREATE TABLE "forms" (
"id" SERIAL PRIMARY KEY,
"name" VARCHAR (150)
);

CREATE TABLE "submission" (
"id" SERIAL PRIMARY KEY,
"user_id" INT references "user",
"form_id" INT references "forms",
"started_at" timestamp default (now() at time zone 'utc'),
"finished_at" timestamp default (now() at time zone 'utc')
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

-- Seed data, needs to be updated to be correct (these arent the actual questions)
-- Seed data for form
INSERT INTO "forms" ("name") VALUES
('Moorhead New Volunteer Form');

-- Seed data for sections
INSERT INTO "sections" ("name", "description", "form_id", "order") VALUES
('Personal Information', 'Basic details about the applicant', (SELECT id FROM "forms" WHERE "name" = 'Volunteer Application Form'), 1),
('Volunteer Experience', 'Details about past volunteering work', (SELECT id FROM "forms" WHERE "name" = 'Volunteer Application Form'), 2),
('Availability', 'Check your availability for volunteering', (SELECT id FROM "forms" WHERE "name" = 'Volunteer Application Form'), 3),
('Skills and Preferences', 'Specific skills and preferences related to volunteering', (SELECT id FROM "forms" WHERE "name" = 'Volunteer Application Form'), 4);

-- Seed data for questions
INSERT INTO "question" ("question", "description", "answer_type", "order", "section_id") VALUES
-- Section 1: Personal Information
('What is your full name?', 'Please enter your first and last name.', 'text', 1, (SELECT id FROM "sections" WHERE "name" = 'Personal Information')),
('What is your date of birth?', 'Enter in the format YYYY-MM-DD.', 'text', 2,  (SELECT id FROM "sections" WHERE "name" = 'Personal Information')),
('What is your email address?', 'This will be used to contact you.', 'text', 3,  (SELECT id FROM "sections" WHERE "name" = 'Personal Information')),
('What is your phone number?', 'Include country code if applicable.', 'text', 4,  (SELECT id FROM "sections" WHERE "name" = 'Personal Information')),
('Do you have any dietary restrictions?', 'Specify if applicable.', 'multiple_choice', 5,  (SELECT id FROM "sections" WHERE "name" = 'Personal Information')),

-- Section 2: Volunteer Experience
('Have you volunteered with us before?', 'Provide details if applicable.', 'text', 1,  (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience')),
('How many years of volunteer experience do you have?', 'Specify in number of years.', 'text', 2, (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience')),
('What type of volunteering have you done before?', 'List relevant types.', 'text', 3, (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience')),
('Why are you interested in volunteering?', 'Briefly describe your motivation.', 'text', 4, (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience')),
('What is your preferred volunteering activity?', 'Select one or more.', 'multiple_choice', 5, (SELECT id FROM "sections" WHERE "name" = 'Volunteer Experience')),

-- Section 3: Availability
('What days of the week are you available?', 'Select all that apply.', 'multiple_choice', 1, (SELECT id FROM "sections" WHERE "name" = 'Availability')),
('What time of the day works best for you?', 'Choose from the options.', 'multiple_choice', 2, (SELECT id FROM "sections" WHERE "name" = 'Availability')),
('How many hours can you commit each week?', 'Provide a rough estimate.', 'text', 3, (SELECT id FROM "sections" WHERE "name" = 'Availability')),
('Are you open to on-call volunteering?', 'Yes or No.', 'multiple_choice', 4, (SELECT id FROM "sections" WHERE "name" = 'Availability')),
('Do you have any upcoming commitments we should be aware of?', 'Provide details.', 'text', 5, (SELECT id FROM "sections" WHERE "name" = 'Availability')),

-- Section 4: Skills and Preferences
('What skills do you bring to volunteering?', 'List relevant skills.', 'text', 1, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences')),
('Do you prefer working with children or adults?', 'Choose one.', 'multiple_choice', 2, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences')),
('Are you comfortable leading activities?', 'Yes or No.', 'multiple_choice', 3, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences')),
('Do you have any certifications related to volunteering?', 'Specify if applicable.', 'text', 4, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences')),
('What type of environment do you prefer?', 'Select one.', 'multiple_choice', 5, (SELECT id FROM "sections" WHERE "name" = 'Skills and Preferences'));

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