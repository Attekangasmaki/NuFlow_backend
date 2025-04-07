


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


### Viimeisimmän HRV-datan haku

GET http://localhost:5000/api/kubios/hrv/latest



### Kaikkien mittausten HRV-datan haku

GET http://localhost:5000/api/kubios/hrv/all
Authorization: bearer




# Esitietolomakkeen tietojen lisääminen

POST http://localhost:5000/api/metrics/insert

  "user_id": "4",
  "drug_use": "EN käytä midiksii",
  "diseases_medications": "En käytä lääkkeitäkään",
  "sleep": "Hyvin tullu nukuttuu täs viimeaikoin",
  "self_assessment": "Nuha polvessa"




### Käyttäjän esitietojen muokkaaminen
PUT http://localhost:5000/api/metrics/:id id = metric_id


{
  "user_id": "4",
  "drug_use": "Alkanu käyttää kofeiinii",
  "diseases_medications": "Verenpainelääkkeet",
  "sleep": "Ei oo nukkumattii näkyny",
  "self_assessment": "Edelleen nuha polvessa"
}



### Hae käyttäjän esitietolomakkeen tiedot
GET  http://localhost:5000/api/metrics/:id id = user_id

# Päiväkirjamerkinnän lisääminen

POST http://localhost:5000/api/entries/insert


{
 "user_id": "4",
 "entry_date": "2025-04-01",
 "time_of_day": "morning",
 "sleep_duration": "2.5",
 "sleep_notes": "tosi kiva fiilis",
 "current_mood": "4",
 "activity": "Lenkillä kävin tossa"
}

# Päiväkirjamerkinnän tietojen muokkaaminen

PUT http://localhost:5000/api/entries/:id  id = entry_id


{
 "user_id": "4",
 "entry_date": "2025-04-01",
 "time_of_day": "evening",
 "sleep_duration": "3.5",
 "sleep_notes": "Parempi fiilis",
 "current_mood": "5"
}



# Käyttäjän kaikkien päiväkirjamerkintöjen haku user_id perusteella.

GET  http://localhost:5000/api/entries/user/:id




