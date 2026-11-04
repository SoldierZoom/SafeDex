# Safedex Setup
Note: All cmds below were done on windows so if on a different OS you may want to find an equivalent cmd
## Clone repo
1. Open terminal wherever you want to clone repo and use your preferred method to clone it
## Set Up Database
2. Navigate to safedexdb and open postgres in the terminal: ` psql -U postgres `
3. Create Database, quit postgres and dump data
```bash
postgres=# CREATE DATABASE safedexdb;
postgres=# \q
PS C:\...\LogicLuminaries\safedexdb> psql -U postgres -d safedexdb -f safedex_dump.sql
```
### Database Credentials
- Username: `postgres`
- Password: `password`
## Start backend
4. Either open in IntelliJ and run SafedexApplication or navigate to safedex-backend in terminal and run: `.\mvnw.cmd spring-boot:run`
## Start frontend
5. navigate to safedex-frontend and run (Make sure you have Node.js b4 running):
```bash
PS C:\...\LogicLuminaries\safedex-frontend> npm install
PS C:\...\LogicLuminaries\safedex-frontend> npm start
```
Note: When testing setting up the project I got some leaflet errors so you may want to also run `npm install leaflet`
## All done!