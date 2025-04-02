# Rekistöröityminen

POST http://localhost:5000/api/users


    {
    "email": "testaaja@hospital.com",
    "password": "S2alakala"
  }

# Kirjautuminen


POST http://localhost:5000/api/auth/login

{
  "email": "testaaja@hospital.com",
  "password": "S2alakala"
}


# Esitetolomakkeen tietojen lisääminen 1/2

POST http://localhost:5000/api/users/userinfo/:id

{
  "first_name": "Janne",
  "last_name": "Jakonen",
  "birthday": "1990-01-03",
  "height": "185.00",
  "weight": "75.00",
  "gender": "male",
  "user_id": "4"
}

# Esitietolomakkeen tietojen lisääminen 2/2

POST http://localhost:5000/api/metrics/insert

  "user_id": "4",
  "drug_use": "EN käytä midiksii",
  "diseases_medications": "En käytä lääkkeitäkään",
  "sleep": "Hyvin tullu nukuttuu täs viimeaikoin",
  "self_assessment": "Nuha polvessa"


### Käyttäjän esitietojen muokkaaminen 1/2
PUT http://localhost:5000/api/users/userinfo/:id id = user_id


{
  "first_name": "Janna",
  "last_name": "Jakonen",
  "birthday": "1990-01-03",
  "height": "185.00",
  "weight": "75.00",
  "gender": "female",
  "user_id": "4"
}

### Käyttäjän esitietojen muokkaaminen 2/2
PUT http://localhost:5000/api/metrics/:id id = metric_id


{
  "user_id": "4",
  "drug_use": "Alkanu käyttää kofeiinii",
  "diseases_medications": "Verenpainelääkkeet",
  "sleep": "Ei oo nukkumattii näkyny",
  "self_assessment": "Edelleen nuha polvessa"
}

### Hae käyttäjän tiedot
GET  http://localhost:5000/api/users/:id id = user_id


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

# HRV-arvojen hakeminen päivän perusteella

GET  http://localhost:5000/api/entries/hrv/:date   date = esim. 2024-03-25



