echo "Rebuilding frontend container"
echo "Step 1"
docker-compose up -d --build frontend
echo "Step 2"
docker-compose exec frontend npm run build
echo "Rebuild finished"
