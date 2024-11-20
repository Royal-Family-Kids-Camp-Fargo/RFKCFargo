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
"name" VARCHAR(32)
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
('Personal Information', 'Basic details about the applicant', 1, 1),
('Volunteer Experience', 'Details about past volunteering work', 1, 2),
('Availability', 'Check your availability for volunteering', 1, 3),
('Skills and Preferences', 'Specific skills and preferences related to volunteering', 1, 4);

-- Seed data for questions
INSERT INTO "question" ("question", "description", "answer_type", "order", "section_id") VALUES
-- Section 1: Personal Information
('What is your full name?', 'Please enter your first and last name.', 'text', 1, 1),
('What is your date of birth?', 'Enter in the format YYYY-MM-DD.', 'text', 2, 1),
('What is your email address?', 'This will be used to contact you.', 'text', 3, 1),
('What is your phone number?', 'Include country code if applicable.', 'text', 4, 1),
('Do you have any dietary restrictions?', 'Specify if applicable.', 'multiple_choice', 5, 1),

-- Section 2: Volunteer Experience
('Have you volunteered with us before?', 'Provide details if applicable.', 'text', 1, 2),
('How many years of volunteer experience do you have?', 'Specify in number of years.', 'text', 2, 2),
('What type of volunteering have you done before?', 'List relevant types.', 'text', 3, 2),
('Why are you interested in volunteering?', 'Briefly describe your motivation.', 'text', 4, 2),
('What is your preferred volunteering activity?', 'Select one or more.', 'multiple_choice', 5, 2),

-- Section 3: Availability
('What days of the week are you available?', 'Select all that apply.', 'multiple_choice', 1, 3),
('What time of the day works best for you?', 'Choose from the options.', 'multiple_choice', 2, 3),
('How many hours can you commit each week?', 'Provide a rough estimate.', 'text', 3, 3),
('Are you open to on-call volunteering?', 'Yes or No.', 'multiple_choice', 4, 3),
('Do you have any upcoming commitments we should be aware of?', 'Provide details.', 'text', 5, 3),

-- Section 4: Skills and Preferences
('What skills do you bring to volunteering?', 'List relevant skills.', 'text', 1, 4),
('Do you prefer working with children or adults?', 'Choose one.', 'multiple_choice', 2, 4),
('Are you comfortable leading activities?', 'Yes or No.', 'multiple_choice', 3, 4),
('Do you have any certifications related to volunteering?', 'Specify if applicable.', 'text', 4, 4),
('What type of environment do you prefer?', 'Select one.', 'multiple_choice', 5, 4);

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