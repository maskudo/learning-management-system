poetry shell
docker start pgsql
uvicorn main:app --reload
bash
