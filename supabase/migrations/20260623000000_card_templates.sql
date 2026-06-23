create table if not exists card_templates (
  id               bigint generated always as identity primary key,
  name             text        not null,
  status           text        not null default 'draft',
  image_data       text,
  fields           jsonb       not null default '[]',
  organization_name text,
  card_year        text,
  created_at       timestamptz not null default now()
);
