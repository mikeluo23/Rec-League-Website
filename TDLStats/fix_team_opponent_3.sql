UPDATE player_game_stats_raw
SET team_name =
  CASE
    WHEN table_index = 1 THEN
      REGEXP_REPLACE(SUBSTRING_INDEX(game_id, '-vs-', 1), '^[0-9]+-', '')
    WHEN table_index = 2 THEN
      REGEXP_REPLACE(SUBSTRING_INDEX(game_id, '-vs-', -1), '^[0-9]+-', '')
    ELSE NULL
  END,
team_name = REGEXP_REPLACE(team_name, '-[0-9]+$', '')
WHERE team_name IS NULL OR team_name = '';

UPDATE player_game_stats_raw
SET opponent_name = 
CASE
    WHEN table_index = 2 THEN
      REGEXP_REPLACE(SUBSTRING_INDEX(game_id, '-vs-', 1), '^[0-9]+-', '')
    WHEN table_index = 1 THEN
      REGEXP_REPLACE(SUBSTRING_INDEX(game_id, '-vs-', -1), '^[0-9]+-', '')
    ELSE NULL
  END, 
opponent_name = REGEXP_REPLACE(opponent_name, '-[0-9]+$', '')
WHERE opponent_name IS NULL OR opponent_name = '';
