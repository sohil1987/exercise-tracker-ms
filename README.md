# Exercise Tracker Microservice

This is a solution for the _Beta_ Free Code Camp Curriculum [Exercise Tracker Microservice](https://fuschia-custard.glitch.me/) project which is built using [Glitch](https://glitch.com/).

It uses nodejs, expressjs, and mongoose to access a MongoDB backend. 

## Test Queries for the Get API
**All records for this user**

```https://exercise-tracker-ms.glitch.me/api/exercise/log?5a9b2c5b9c424f18ca10b1a6```


**All records for this user between 2018-01-01 and 2018-03-04**

```https://exercise-tracker-ms.glitch.me/api/exercise/log?5a9b2c5b9c424f18ca10b1a6&2018-01-01&2018-03-04```

**All records for this user between 2017-10-01 and 2017-12-31**

```https://exercise-tracker-ms.glitch.me/api/exercise/log?5a9b2c5b9c424f18ca10b1a6&2017-10-01&2017-12-31```

**2 records for this user between 2017-10-01 and 2018-03-4**

```https://exercise-tracker-ms.glitch.me/api/exercise/log?5a9b2c5b9c424f18ca10b1a6&2017-10-01&2018-03-04&2```



## Known Issues
- Does not do input data validation
