##Battle Cards Service

## Installation requires postgres 9.5

```
git clone ssh://git@stash.is.com:7999/sha/battle-card-service.git
cd battle-card-service
npm install
```

## Usage
```
npm run local
```

## Testing

Run the following to invoke tests.

```
$ npm test
```

### Version information
*Version* : 0.01

## /api/v1/card

## Paths
### GET /status
get version and see if the server is running

### GET /card
get a list of all battlecards

### GET /card/ID
get a single battlecard by id

### GET /card/team/teamId
get a list of battlecards for a team

### POST /card
create a new battlecard

### PUT /card/ID
update an existing battlecard by id

#database udpates handled by umzug https://github.com/sequelize/umzug
