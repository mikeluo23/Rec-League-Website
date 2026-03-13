UPDATE player_game_stats
SET team_name = REGEXP_REPLACE(team_name, '-[0-9]+$', '');

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
where
team_name in ('manhattan-elite',
'texas-elite', 'bkysc', 'pippen-aint-easy',
'ibaka-flaka-flame', 'nj-rockets', 'smooth-buckets', 
'manhattan-mayo-clinic', 'brickstone-associates')
group by player_name
order by avg_pts desc;

select * from player_game_stats