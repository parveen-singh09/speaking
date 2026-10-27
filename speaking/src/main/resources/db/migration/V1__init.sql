create table users (
    id            bigserial primary key,
    google_sub    varchar(255) unique not null,
    email         varchar(255) not null,
    name          varchar(255),
    avatar_url    varchar(1024),
    bio           text,
    english_level varchar(32),
    created_at    timestamptz not null default now()
);
