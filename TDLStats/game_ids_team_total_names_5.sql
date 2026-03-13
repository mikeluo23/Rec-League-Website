insert into games (game_key)
select distinct game_id from team_game_totals;

insert into games (game_url)
select distinct game_url from team_game_totals;

SELECT
  game_key,
  -- left side team
  REGEXP_REPLACE(
    REGEXP_REPLACE(SUBSTRING_INDEX(game_key, '-vs-', 1), '^[0-9]+-', ''),
    '-[0-9]+$',
    ''
  ) AS team1_clean,
  -- right side team
  REGEXP_REPLACE(
    REGEXP_REPLACE(SUBSTRING_INDEX(game_key, '-vs-', -1), '^[0-9]+-', ''),
    '-[0-9]+$',
    ''
  ) AS team2_clean
FROM games
WHERE game_key LIKE '%-vs-%'
LIMIT 25;

UPDATE games g
JOIN teams t1
  ON t1.team_name = REGEXP_REPLACE(SUBSTRING_INDEX(g.game_key, '-vs-', 1), '^[0-9]+-', '')
JOIN teams t2
  ON t2.team_name = REGEXP_REPLACE(SUBSTRING_INDEX(g.game_key, '-vs-', -1), '^[0-9]+-', '')
SET g.team1_id = t1.team_id,
    g.team2_id = t2.team_id;

UPDATE games g
JOIN teams t1
  ON t1.team_name = REGEXP_REPLACE(
       REGEXP_REPLACE(SUBSTRING_INDEX(g.game_key, '-vs-', 1), '^[0-9]+-', ''),
       '-[0-9]+$',
       ''
     )
JOIN teams t2
  ON t2.team_name = REGEXP_REPLACE(
       REGEXP_REPLACE(SUBSTRING_INDEX(g.game_key, '-vs-', -1), '^[0-9]+-', ''),
       '-[0-9]+$',
       ''
     )
SET g.team1_id = t1.team_id,
    g.team2_id = t2.team_id;
    
 create table d3_games (
 select * from games where team1_id is NOT NULL);
 
 #-------------------------including teamname in team_game_totals-----------------#
UPDATE team_game_totals
SET team_name =
  CASE
    WHEN table_index = 1 THEN
      REGEXP_REPLACE(
        REGEXP_REPLACE(SUBSTRING_INDEX(game_id, '-vs-', 1), '^[0-9]+-', ''),
        '(-[0-9]+)+$',
        ''
      )
    WHEN table_index = 2 THEN
      REGEXP_REPLACE(
        REGEXP_REPLACE(SUBSTRING_INDEX(game_id, '-vs-', -1), '^[0-9]+-', ''),
        '(-[0-9]+)+$',
        ''
      )
  END
WHERE team_name IS NULL OR team_name = '';

create table d3_team_game_totals (
SELECT * from team_game_totals 
WHERE team_name in (SELECT team_name from teams));

