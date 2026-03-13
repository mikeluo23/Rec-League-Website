create table if not exists d3_game_stats_raw(
select * from player_game_stats_raw
where team_name in (SELECT team_name from teams)
);

UPDATE d3_game_stats_raw
SET player_name =
  CASE
    WHEN player_name REGEXP '^([A-Za-z] ){3,}[A-Za-z]$' THEN
      TRIM(
        REGEXP_REPLACE(
          REPLACE(player_name, ' ', ''),
          '([[:lower:]])([[:upper:]])',
          '$1 $2'
        )
      )
    WHEN player_name NOT REGEXP '[[:space:]]' THEN
      TRIM(
        REGEXP_REPLACE(
          player_name,
          '([[:lower:]])([[:upper:]])',
          '$1 $2'
        )
      )
    ELSE
      TRIM(REGEXP_REPLACE(player_name, '[[:space:]]+', ' '))
  END
WHERE
  player_name REGEXP '^([A-Za-z] ){3,}[A-Za-z]$'
  OR player_name REGEXP '[[:lower:]][[:upper:]]'
  OR player_name REGEXP '[[:space:]]{2,}';
  
 INSERT INTO players (player_name)
 SELECT distinct player_name from d3_game_stats_raw;
 SELECT distinct player_name from d3_game_stats_raw;