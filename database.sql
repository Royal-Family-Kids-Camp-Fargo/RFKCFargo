-- database name: rfkc
-- 13 tables

CREATE TABLE "user" (
"id" SERIAL PRIMARY KEY,
"username" VARCHAR (150) NOT NULL unique,
"password" VARCHAR (1000) NOT NULL,
"first_name" VARCHAR (35),
"last_name" VARCHAR(30),
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