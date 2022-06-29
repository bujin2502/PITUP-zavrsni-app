# PITUP-zavrsni-app

Za pokretanje apliacije "Alarm", nakon skidanja na osobno računalo potrebno je sljedeće:
1. Dodati točku na početku imena datoteke env (.env)
2. Unutar mape s datotekama pokrenuti komandni redak i instalirati potrebne dodatke uz pomoć komande "npm install" (po potrebi kao administrator / sudo)
3. Pokrenuti aplikaciju uz komandu "node app" (ili "nodemon app", ali prije toga je potrebno instalirati nodemon uz pomoć komande "npm nodemon")
4. Otvoriti preglednik i upisati "http://localhost:3000/"
5. Za logiranje u sustav na raspolaganju su 5 različitih računa iz različitih institucija. E-mail adrese su:
  a) Zdravstvo - bpracic@miz.hr
  b) Policija - jure.pavlic@mup.hr
  c) Socijalna skrb - branko.horvat@czss.hr
  d) Školstvo - neda.bilan@skole.hr
  e) MORH - ivica.matanovic@morh.hr
6. Za sve korisnike je ista lozinka: foi-123456
MORH adresa ne može unositi podatke (tu je radi prikaza mogućnosti), ali može vidjeti liste.
Ostale institucije mogu pristupiti dijelu vezanom uz njihov djelokrug rada.
Alarm listu s top 10 ugrožene djece mogu vidjeti svi i uputiti nadzor te to potvrditi klikom na gumb "Poslati nadzor". Nakon klika na gumb, djete se uklanja s popisa i lista se penje za jedno mjesto.
Korisnik ima pregled svih osoba (Ukupna lista) kako bi utvrdio ima li ispravan OIB.
Svaki korisnik može unjeti događaj, a u skladu sa svojim ovlastima (Unos događaja - "područje")

U slučaju nefunkcionalnosti ili bilo kakvih upita kontaktirati autora aplikacije, Zlatka Pračića na e-mail: zpracic@foi.hr
