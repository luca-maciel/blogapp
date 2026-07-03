npx tsc -p tsconfig.models.json --watch &
npx tsc -p tsconfig.routes.json --watch &
npx tsc -p tsconfig.app.json --watch &
npx tsc -p tsconfig.Categoria.json --watch &
npx tsc -p tsconfig.Postagem.json --watch &
npx tsc -p tsconfig.Usuario.json --watch &

nodemon app.js &

wait