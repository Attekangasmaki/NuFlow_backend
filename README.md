# Rekistöröityminen

POST http://localhost:5000/api/users
Content-Type: application/json

    {
    "email": "testaaja@hospital.com",
    "password": "S2alakala"
  }

# Kirjautuminen


POST http://localhost:5000/api/auth/login
content-type: application/json

{
  "email": "testaaja@hospital.com",
  "password": "S2alakala"
}


# Esitetolomakkeen tiedot 1/2

POST http://localhost:5000/api/users/userinfo/:id
content-type: application/json

{
  "first_name": "Janne",
  "last_name": "Jakonen",
  "birthday": "1990-01-03",
  "height": "185.00",
  "weight": "75.00",
  "gender": "male",
  "user_id": "4"
}

# Esitietolomakkeen tiedot 2/2

POST http://localhost:5000/api/metrics/insert
  "user_id": "4",
  "drug_use": "EN käytä midiksii",
  "diseases_medications": "En käytä lääkkeitäkään",
  "sleep": "Hyvin tullu nukuttuu täs viimeaikoin",
  "self_assessment": "Nuha polvessa"
