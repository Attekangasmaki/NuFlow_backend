*** Settings ***
Library    RequestsLibrary
Library    Collections
Suite Setup    Authenticate as Admin         # Suoritetaan ennen testitapauksia

*** Keywords ***
Authenticate user
    [Documentation]  Kirjaudutaan sisään ylläpitäjän oikeuksilla.
    ...              - Aluksi luodaan rakenne (Dictionary), joka sisältää käyttäjänimen ja salasanan
    ...              - body-rakenne annetaan POST metodille JSON-parametrina
    ...              - Palautteena tuleva JSON-rakenne tulostetaan lokitiedostoon
    ...              - JSON rakenteesta kaivetaan esiin token
    ...              - Token tulostetaan myös lokitiedostoon
    ...              - Lopuksi token tallennetaa testijoukon muuttujiin muita kutsuja varten
    ${body}    Create Dictionary    username=elsikubios    password=750GmuduMdLX
    ${response}    POST    url=POST http://localhost:5000/api/auth    json=${body}
    Log    ${response.json()}
    ${token}    Set Variable    ${response.json()}[token]
    Log    ${token}
    Set Suite Variable    ${token}


