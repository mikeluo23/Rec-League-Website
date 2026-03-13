from fastapi import FastAPI
from sqlalchemy import create_engine, text

app = FastAPI()

engine = create_engine(
    "mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/rec_league"
)

@app.get("/leaderboard")
def leaderboard():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT player_name,
                   SUM(pts) AS total_pts
            FROM player_game_stats
            GROUP BY player_name
            ORDER BY total_pts DESC
        """))
        return [dict(row._mapping) for row in result]