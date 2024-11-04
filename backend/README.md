## Priprema za deploy na Render:

- po potrebi dodati environment varijable u _run_ konfiguraciju vašeg IDE-a
- dodati Dockerfile - u direktoriju docker
- preporuca se u application.properties postaviti property server.servlet.context-path na /api kao prefiks svim
  zahtjevima na backend
- (opcionalno) u application.properties dodati željene env. varijable u formatu:
  some.property=${ENV_VAR_NAME:default value}
    - primjer u ovome repozitoriju (src/main/resources)
- (opcionalno) u pom.xml kao dependency dodati spring-boot-starter-actuator (prema primjeru u ovom repozitoriju) koji ce
  na putanju /actuator/health automatski izloziti informaciju o zdravlju aplikacije koju moze koristiti Render (health
  check kasnije u uputama)

## Deploy:

### Kreiranje baze podataka:

Važno! - baza se automatski briše nakon 30 dana i potrebno ju je rekreirati, možete koristiti H2 in-memory bazu pa
se prebaciti na PostgreSQL nekoliko tjedana prije demonstracije.

U Render dashboardu:

- New -> PostgreSQL
- Postaviti ime baze i opcionalno username za korisnika baze (password je automatski generiran)
- Create Database
- Free plan baza podataka ima max. pohranu od 1GB, te se baza briše nakon 90 dana.

### Kreiranje backenda:

U Render dashboardu:

- New -> Web Service
- Povezati GitHub racun, nakon cega su za odabir dostupni svi projekti na koje imate prava pristupa
- Stisnuti connect pored odgovarajućeg projekta
- Postaviti ime za servis (postat ce dio web adrese)
- Root directory ostaviti prazan
- Environment Docker
- Na dnu prosiriti _advanced_
- Dodati potrebne environment varijable (npr. DB username, password, URL), ako se koristi PostgreSQL baza kopirati
  vrijednosti iz postavki baze podataka na Renderu. Pripaziti jer URL koji je prikazan na Renderu nije JDBC URL, za ovaj
  primjer treba biti u formatu `jdbc:postgresql://hostname:port/database`
- Ukoliko je dodan Spring Boot Actuator (prema zadnjoj tocki poglavlja pripreme za deploy) postaviti
  `/api/actuator/health` kao Health Check Path (odnosno [<server.servlet.context-path>](./src/main/resources/application.properties)/actuator/health)
- Postaviti putanju za Dockerfile ovisno koji se package manager koristi (u ovom slucaju `./docker/maven/Dockerfile`)
- Stisnuti Create Web Service
