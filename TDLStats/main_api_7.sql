alter table d3_games
add primary key (id);

CREATE TABLE IF NOT EXISTS player_game_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id INT NOT NULL,
  player_id INT NOT NULL,
  team_id INT NOT NULL,

  pts INT,
  reb INT,
  ast INT,
  blk INT,
  stl INT,
  tov INT,
  fouls INT,

  fgm INT,
  fga INT,
  fg_pct DECIMAL(10,4),

  tpm INT,
  tpa INT,
  tp_pct DECIMAL(10,4),

  ftm INT,
  fta INT,
  ft_pct DECIMAL(10,4),

  UNIQUE (game_id, player_id, team_id),

  FOREIGN KEY (game_id) REFERENCES d3_games(id),
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

INSERT IGNORE INTO player_game_stats (
  game_id, player_id, team_id,
  pts, reb, ast, blk, stl, tov, fouls,
  fgm, fga, fg_pct,
  tpm, tpa, tp_pct,
  ftm, fta, ft_pct
)
SELECT
  g.id AS game_id,
  p.player_id,
  CASE
    WHEN r.table_index = 1 THEN g.team1_id
    WHEN r.table_index = 2 THEN g.team2_id
  END AS team_id,

  r.pts, r.reb, r.ast, r.blk, r.stl, r.tov, r.pf,
  r.fgm, r.fga, r.fg_pct,
  r.tpm, r.tpa, r.tp_pct,
  r.ftm, r.fta, r.ft_pct
FROM d3_game_stats_raw r
JOIN players p ON p.player_name = r.player_name
JOIN d3_games g ON g.game_key = r.game_id
WHERE r.table_index IN (1,2)
  AND g.team1_id IS NOT NULL
  AND g.team2_id IS NOT NULL;
  
CREATE INDEX idx_pgs_player ON player_game_stats(player_id);
CREATE INDEX idx_pgs_team   ON player_game_stats(team_id);
CREATE INDEX idx_pgs_game   ON player_game_stats(game_id);

CREATE INDEX idx_games_team1 ON d3_games(team1_id);
CREATE INDEX idx_games_team2 ON d3_games(team2_id);