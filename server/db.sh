docker run \
	--name pgsql \
	-e POSTGRES_PASSWORD=test1234 \
	-d \
	-v "${PWD}"/postgres-docker:/var/lib/postgresql/data \
	-p 5432:5432 postgres
