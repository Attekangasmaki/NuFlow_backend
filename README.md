[Dokumentaatio](docs/index.html)


# Käyttäjän toiminnallisuudet

### Sisäänkirjautuminen

POST http://localhost:5000/api/auth/login


{
  "username": "oma-kubios-käyttäjä",
  "password": "oma-kubios-salasana"
}


### Käyttäjän tietojen haku

GET http://localhost:5000/api/kubios/user-info


### Käyttäjän tietojen muokkaus (emailia ja syntymäaikaa ei voi muokata)

PATCH http://localhost:5000/api/kubios/userinfo


### Käyttäjän poistaminen

DELETE http://localhost:5000/api/auth/delete/:id

id = userId

### Käyttäjän avatarlinkin lisääminen

POST http://localhost:5000/api/auth/avatar/insert


### Käyttäjän avatarlinkin haku.

GET http://localhost:5000/api/auth/avatar



# HRV

### Hakee viimeiset 7 mittausta.

GET http://localhost:5000/api/kubios/hrv/last-7-measurements


### Hakee viimeiset 30 mittausta.

GET http://localhost:5000/api/kubios/hrv/last-30-measurements

### Hakee viimeisen seitsemän päivän mittaukset.

GET http://localhost:5000/api/kubios/hrv/last-week


### Hakee viimeisen kolmenkymmenen päivän mittaukset.

GET http://localhost:5000/api/kubios/hrv/last-month


### HRV-datan haku päivämäärän perusteella

GET http://localhost:5000/api/kubios/hrv/by-date/:date


### Viimeisimmän HRV-datan haku

GET http://localhost:5000/api/kubios/hrv/latest





### Kaikkien mittausten HRV-datan haku

GET http://localhost:5000/api/kubios/hrv/all



# Esitiedot

### Esitietolomakkeen tietojen lisääminen

POST http://localhost:5000/api/metrics/insert

  "drug_use": "EN käytä midiksii",
  "diseases_medications": "En käytä lääkkeitäkään",
  "sleep": "Hyvin tullu nukuttuu täs viimeaikoin",
  "self_assessment": "Nuha polvessa"


### Käyttäjän esitietojen muokkaaminen
PUT http://localhost:5000/api/metrics/:id id = metric_id

{
  "drug_use": "Alkanu käyttää kofeiinii",
  "diseases_medications": "Verenpainelääkkeet",
  "sleep": "Ei oo nukkumattii näkyny",
  "self_assessment": "Edelleen nuha polvessa"
}


### Hae käyttäjän esitietolomakkeen tiedot
GET  http://localhost:5000/api/metrics/:id id = user_id


# Päiväkirjamerkinnät

### Päiväkirjamerkinnän lisääminen

POST http://localhost:5000/api/entries/insert

{
 "entry_date": "2025-04-28",
 "time_of_day": "morning",
 "sleep_duration": "2.5",
 "sleep_notes": "tosi kiva fiilis",
 "current_mood": "4",
 "activity": "Lenkillä kävin tossa"
}


### Päiväkirjamerkinnän tietojen muokkaaminen

PUT http://localhost:5000/api/entries/:id id = entry_id

{
 "entry_date": "2025-04-01",
 "time_of_day": "evening",
 "sleep_duration": "3.5",
 "sleep_notes": "Parempi fiilis",
 "current_mood": "5"
}


### Käyttäjän kaikkien päiväkirjamerkintöjen haku.

GET  http://localhost:5000/api/entries/user




