USE rec_league_new;

CREATE TABLE if not exists player_game_stats_raw (
    player_name VARCHAR(255),
    pts INT,
    reb INT,
    ast INT,
    stl INT,
    blk INT,
    fgm INT,
    fga INT,
    fg_pct FLOAT,
    tpm INT,
    tpa INT,
    tp_pct FLOAT,
    ftm INT,
    fta INT,
    ft_pct FLOAT,
    tov INT,
    pf INT,
    game_id VARCHAR(255),
    game_url TEXT,
    table_index INT,
    team_name VARCHAR(255),
    id INT AUTO_INCREMENT PRIMARY KEY
);

LOAD DATA LOCAL INFILE 'C:/player_game_stats_rawUsers/luomi/Downloads/TDLStats/player_game_stats.csv'
INTO TABLE player_game_stats_raw
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

ALTER TABLE player_game_stats_raw
ADD COLUMN team_name VARCHAR(255);

ALTER TABLE player_game_stats_raw
ADD COLUMN opponent_name VARCHAR(255);

create table if not exists teams(
team_id INT AUTO_INCREMENT PRIMARY KEY,
team_name VARCHAR(255) UNIQUE
);

CREATE TABLE if not exists games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_key VARCHAR(255) NOT NULL UNIQUE,   -- the string id from your CSVs
  game_url TEXT NULL,
  game_date DATE NULL,

  team1_id INT NULL,
  team2_id INT NULL,

  FOREIGN KEY (team1_id) REFERENCES teams(team_id),
  FOREIGN KEY (team2_id) REFERENCES teams(team_id)
);


CREATE TABLE if not exists players (
player_id INT AUTO_INCREMENT PRIMARY KEY,
player_name VARCHAR(255));

CREATE TABLE if not exists players_game_stats_d3 (
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
  FOREIGN KEY (game_id) REFERENCES games(id),
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id)
);