alter table reviews add column if not exists image_data text;

create table if not exists site_stats (
  id     int primary key,
  visits bigint not null default 0
);
