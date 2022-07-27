# PITUP-zavrsni-app

Za pokretanje apliacije "Alarm", nakon skidanja na osobno računalo potrebno je sljedeće:

0. Pretpostavka je kako je instaliran Node.js na računalo.
1. Unutar mape s datotekama pokrenuti komandni redak i instalirati potrebne dodatke uz pomoć komande "npm install" (po potrebi kao administrator / sudo)
2. Pokrenuti aplikaciju uz komandu "nodemon app"
3. Za logiranje u sustav na raspolaganju su 5 različitih računa iz različitih institucija. E-mail adrese su:
  a) Zdravstvo - bpracic@miz.hr
  b) Policija - jure.pavlic@mup.hr
  c) Socijalna skrb - branko.horvat@czss.hr
  d) Školstvo - neda.bilan@skole.hr
  e) MORH - ivica.matanovic@morh.hr
6. Za sve korisnike je ista lozinka: foi-123456
MORH adresa ne može unositi podatke (tu je radi prikaza mogućnosti), ali može vidjeti liste.
Ostale institucije mogu pristupiti dijelu vezanom uz njihov djelokrug rada.
Alarm listu s top 10 ugrožene djece mogu vidjeti svi i uputiti nadzor te to potvrditi klikom na gumb "Poslati nadzor".
Nakon klika na gumb, djete se uklanja s popisa i lista se penje za jedno mjesto.
Korisnik ima pregled svih osoba (Ukupna lista) kako bi utvrdio ima li ispravan OIB.
Svaki korisnik može unjeti događaj, a u skladu sa svojim ovlastima (Unos događaja - "područje")

Moguć je grafički prikaz. Prvi tab daje model baze podataka.
Drugi tab ima tri ploče, prva je popis 10 ugrožene djece, drugi je namjenjen unosu OIB-a kako bi se u trećem mogla vidjeti ukupna situacija vezana uz dijete čiji je OIB unešen.

Aplikacija je rađena uz pomoć Node.js. Ukoliko se želi dobiti izvršna datoteka (za Windows, Linux i MacOS) potrebno je uz pomoć komande "npm pkg" skinuti potrebni dodataka i pokrenuti pakiranje aplikacije u izvršnu datoteku komandom "pkg ."

U slučaju nefunkcionalnosti ili bilo kakvih upita kontaktirati autora aplikacije, Zlatka Pračića na e-mail: zpracic@foi.hr
