ALTER TABLE d3_team_game_totals
ADD COLUMN game_id_int INT NULL,
ADD COLUMN team_id INT NULL;

UPDATE d3_team_game_totals tgt
JOIN d3_games g on g.game_key = tgt.game_id
SET tgt.game_id_int = g.id
WHERE tgt.game_id_int IS NULL;

UPDATE d3_team_game_totals tgt
JOIN teams t on tgt.team_name = t.team_name
SET tgt.team_id = t.team_id
WHERE tgt.team_id IS NULL;