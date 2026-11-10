create table friendships (
    id           bigserial primary key,
    requester_id bigint not null references users(id),
    addressee_id bigint not null references users(id),
    status       varchar(16) not null default 'pending',
    created_at   timestamptz not null default now(),
    unique (requester_id, addressee_id),
    check (requester_id <> addressee_id)
);

create index idx_friendships_addressee on friendships(addressee_id);
create index idx_friendships_requester on friendships(requester_id);
