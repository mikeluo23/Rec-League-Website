USE rec_league;



DROP TABLE player_game_stats;

CREATE TABLE player_game_stats (
    #id INT AUTO_INCREMENT PRIMARY KEY,
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
    team_name VARCHAR(255)
);


LOAD DATA LOCAL INFILE '\Users\luomi\Downloads\TDLStats\player_game_stats.csv'
INTO TABLE player_game_stats
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

select * from player_game_stats;

select player_name, COUNT(*) AS games_played, round(avg(pts), 2) as avg_pts, round(avg(reb),2) as avg_reb,
round(avg(ast),2) as avg_ast, round(avg(blk),2) as avg_blk, round(avg(stl),2) as avg_stl,
round(avg(tov),2) as avg_tov, round(avg(pf),2) as avg_fouls, 
sum(fgm) as fgm, sum(fga) as fga, 
case
	when sum(fga) = 0 then 0
	else sum(fgm)/sum(fga)
end as fg_pct,
sum(ftm) as ftm, sum(fta) as fta, 
case
	when sum(fta) = 0 then 0
	else sum(ftm)/sum(fta)
end as ft_pct,
sum(tpm) as 3ptm, sum(tpa) as 3pta, 
case
	when sum(tpa) = 0 then 0
	else sum(tpm)/sum(tpa)
end as 3pt_pct
from player_game_stats
group by player_name
order by avg_pts desc;

select player_name, SUM(fgm + 0.5*tpm)/SUM(fga) AS efg_pct, 
SUM(pts) / (2 * (SUM(fga) + 0.44 * SUM(fta))) AS ts_pct,
SUM(ast)/NULLIF(SUM(tov),0) AS ast_to_ratio
from player_game_stats
group by player_name
order by ts_pct desc;

select
CASE
    WHEN table_index = 1 THEN
      REGEXP_REPLACE(SUBSTRING_INDEX(game_id, '-vs-', 1), '^[0-9]+-', '')
    WHEN table_index = 2 THEN
      REGEXP_REPLACE(SUBSTRING_INDEX(game_id, '-vs-', -1), '^[0-9]+-', '')
    ELSE NULL
END as team_name
from player_game_stats;

ALTER TABLE player_game_stats
ADD COLUMN team_name VARCHAR(255);

ALTER TABLE player_game_stats
ADD COLUMN opponent_name VARCHAR(255);

UPDATE player_game_stats
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

UPDATE player_game_stats
SET opponent_name = 
CASE
    WHEN table_index = 2 THEN
      REGEXP_REPLACE(SUBSTRING_INDEX(game_id, '-vs-', 1), '^[0-9]+-', '')
    WHEN table_index = 1 THEN
      REGEXP_REPLACE(SUBSTRING_INDEX(game_id, '-vs-', -1), '^[0-9]+-', '')
    ELSE NULL
  END, 
opponent_name = REGEXP_REPLACE(opponent_name, '-[0-9]+$', '');
#WHERE opponent_name IS NULL OR opponent_name = '';

CREATE USER 'recapp'@'localhost' IDENTIFIED BY 'recapp_pw_123';
GRANT ALL PRIVILEGES ON rec_league.* TO 'recapp'@'localhost';
FLUSH PRIVILEGES;

SELECT USER(), CURRENT_USER();

