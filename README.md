# Battlesnake 2019 Board

## Development

```
npm i
npm start
```

## Production

```
npm run build
```

## Running a game

For now you cannot just load the index page or you'll get an error. To make it
do something you need to add the query parameters `engine` (URL of the engine
API) and `game` (ID of the game you want to run). For example:

```
http://localhost:3000/?engine=http%3A%2F%2Flocalhost%3A3005&game=3bb6f305-04fd-4e16-935a-d7a240154dd6
```

Since it is a common pattern to create a game, start it, and then view it in
the browser you can do something like this:

```
GAME_ID=`engine-cli create -c ~/snake-config.json | cut -d'"' -f 2`
engine-cli run -g $GAME_ID
xdg-open "http://localhost:3000?engine=http%3A%2F%2Flocalhost%3A3005&game=$GAME_ID"
```

## Linting and formatting

ESLint and Prettier are setup in this project so you may want to install
compatible plugins in your editor.
