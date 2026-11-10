create table messages (
    id           bigserial primary key,
    sender_id    bigint not null references users(id),
    recipient_id bigint not null references users(id),
    body         varchar(2000) not null,
    created_at   timestamptz not null,
    read_at      timestamptz
);

create index idx_messages_pair on messages(sender_id, recipient_id, created_at);
create index idx_messages_recipient on messages(recipient_id, created_at);
