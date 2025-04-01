# ts-test-assessment

Installation requirements:

* NodeJs ver. 22
* Docker (for the postgres container)

Run the postgres container with the use of the Makefile `make run-postgres`.
To run the service, execute the command `npm i && npm run develop`.

In this template project, we prepared [Express](https://expressjs.com/) TypeScript service template.
To work with databases, we have set up syntax sugar on top of [node-postgres](https://www.npmjs.com/package/pg) with [Flyway schema migration](https://flywaydb.org/).
You can choose any other framework or libraries you prefer, but you have to prepare all corresponding assets prior to the beginning of the assessment.

During the online assessment, you will create a small service interacting with an external API, storing some data in a database and providing HTTP endpoints to interact with the service itself.
You will implement this service step by step during the online session.

**Before** this session, you should set up your environment (IDE, docker, etc). You should also share your screen during the test assessment, so we can discuss and review your actions.
