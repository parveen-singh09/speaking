create table calls (
    id           bigserial primary key,
    caller_id    bigint not null references users(id),
    callee_id    bigint not null references users(id),
    started_at   timestamptz not null default now(),
    ended_at     timestamptz,
    duration_sec integer,
    status       varchar(16) not null default 'active'
);

create index idx_calls_caller on calls(caller_id);
create index idx_calls_callee on calls(callee_id);

create table user_stats (
    user_id        bigint primary key references users(id),
    total_call_sec bigint not null default 0,
    total_calls    integer not null default 0
);
