alter table users add column gender varchar(16);
alter table users add column occupation varchar(32);
alter table users add column location varchar(64);
alter table users add column onboarded boolean not null default false;
