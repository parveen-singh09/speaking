alter table users alter column google_sub drop not null;
alter table users add column password_hash varchar(100);
alter table users add constraint uq_users_email unique (email);
