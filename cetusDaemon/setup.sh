docker build -f="Dockerfile" -t="devtooldocker7585/cetusdeamon:v1" .
docker run --rm -it  -p 3005:3005/tcp devtooldocker7585/cetusdeamon:v1