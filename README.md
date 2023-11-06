## Priprema backenda za deploy na Render:
- po potrebi dodati env. varijable u run konfiguraciju vašeg IDE-a
- dodati Dockerfile - u direktoriju docker postoje dvije verzije, za Maven i Gradle. Ukoliko se mijenja lokacija Dockerfilea paziti na putanje unutar COPY naredbi u Dockerfile skripti
- preporuca se u application.properties postaviti property server.servlet.context-path na /api kao prefiks svim zahtjevima na backend
- (opcionalno) u application.properties dodati željene env. varijable u formatu:
  some.property=${ENV_VAR_NAME:default value}
    - primjer u ovome repozitoriju (progi-be/src/main/resources)
- (opcionalno) u pom.xml dodati dependency-e od Liquibase i H2, te dodati application-dev.properties za lokalni dev profil. Preporučeno da si olaksate zivot prilikom razvoja.
  - Prilikom lokalnog pokretanja u konfiguraciji IDE-a postavite dev profil da bi se koristila H2 baza
  - Važno za Liquibase, jednom deployani changelogovi se ne smiju mijenjati! Promjene nad bazom rade se u novoj changelog datoteci - promjene su inkrementalne. Promjena postojećeg changeloga zahtijeva brisanje baze podataka.
- (opcionalno) u pom.xml kao dependency dodati spring-boot-starter-actuator (prema primjeru u ovom repozitoriju) koji ce na putanju /actuator/health automatski izloziti informaciju o statusu aplikacije koju moze koristiti Render (health check kasnije u uputama)


## Priprema frontenda za deploy na Render:
- u package.json dodati dependencye potrebne za deploy, primarno http-proxy-middleware, dotenv, express
- dodati /src/setupProxy.js koji služi kao proxy server za lokalni development (redirecta api pozive na localhost:8080), odnosno kad se koristi `react-scripts start` skripta
- dodati app.js, u kojem se nalazi express server za produkcijski proxy i posluzivanje frontenda
- u package.json izmijeniti sljedeću skriptu:

  `"build": "yarn install && react-scripts build"`
- i dodati:

  `"start-prod": "node app.js"`

  - u package.json dodati sljedeći odjeljak zbog Node verzije:
  ```
  "engines": {
      "node": ">=18.18.0 <19.0.0"
      },
  ```
- koristenje proxya omogucuje da se pozivi na api izvrsavaju bez potrebe za eksplicitnim pozivom adrese backenda - pogledati App.tsx za primjer


## Deploy:
### Kreiranje baze podataka:
U Render dashboardu:
- New -> PostgreSQL
- Postaviti ime baze i opcionalno username za korisnika baze (password je automatski generiran)
- Region Frankfurt
- Create Database
- Free plan baza podataka ima max. pohranu od 1GB, te se baza briše nakon 90 dana.

### Kreiranje backenda:
U Render dashboardu:
- New -> Web Service
- Povezati GitHub račun, nakon čega su za odabir dostupni svi projekti na koje imate prava pristupa
- Stisnuti connect pored odgovarajućeg projekta
- Postaviti ime za servis (postat ce dio web adrese)
- Root directory postaviti na progi-be
- Environment Docker
- Region Frankfurt
- Na dnu proširiti _advanced_
- Dodati potrebne environment varijable (npr. DB username, password, URL), kopirati vrijednosti iz postavki baze podataka na Renderu. Pripaziti jer URL koji je prikazan na Renderu nije JDBC URL, za ovaj primjer treba biti u formatu `jdbc:postgresql://<hostname>:<port>/<database>`
- Ako je dodan Spring Boot Actuator (prema zadnjoj točki poglavlja pripreme za deploy) postaviti `/api/actuator/health` kao Health Check Path (odnosno <context-path>/actuator/health)
- Postaviti putanju za Dockerfile ovisno koji se package manager koristi (u ovom slučaju `./docker/maven/Dockerfile`)
- Stisnuti Create Web Service


### Kreiranje frontenda:
U Render dashboardu:
- New -> Web Service
- Povezati GitLab racun, nakon cega su za odabir dostupni svi projekti na koje imate prava pristupa
- Stisnuti connect pored odgovarajućeg projekta
- Postaviti ime za servis (postat ce dio web adrese)
- Root directory postaviti na progi-fe
- Environment Node
- Region Frankfurt
- Build Command postaviti na `yarn build`, a Start Command `yarn start-prod`
- Na dnu prosiriti _advanced_
- Dodati potrebne environment varijable - API_BASE_URL postaviti na adresu deployanog backenda aplikacije dostupnu na Render dashboardu
- Stisnuti Create Web Service


Napomena: U free tier-u nakon perioda neaktivnosti aplikacije na Renderu bit će automatski ugašene, te ponovno podignute pri prvom zaprimanju zatjeva (otvaranje web stranice frontenda ili slanje zahtjeva na API).
Ovo može rezultirati s nekoliko minuta nedostupnosti aplikacije ako se otvara npr. prvi put u danu.