## Set env variables

`export PEER_URL="<your_local_ip>"`
`export PEER_PORT="9000"`

## Run peerjs server

`npm i -g peer`
`peerjs --host $PEER_URL --port $PEER_PORT --key peerjs --path /`

## Host game

`npm run dev -- --host`
