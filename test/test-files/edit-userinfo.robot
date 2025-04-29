*** Settings ***
Library    RequestsLibrary
Library    Collections
Suite Setup    Authenticate user    ${username}    ${password}

*** Variables ***
${username}    elsikubios@gmail.com
${password}    750GmuduMdLX
${base_url}    http://localhost:5000/api

*** Test Cases ***
Valid Login Test
    [Documentation]    Testaa, että sisäänkirjautuminen onnistuu oikeilla tunnuksilla.
    Authenticate user    ${username}    ${password}

Update User Information Test
    [Documentation]    Testaa, että käyttäjän tietojen päivitys onnistuu.
    Update User Information

*** Keywords ***
Authenticate user
    [Documentation]    Kirjaudutaan sisään ylläpitäjän oikeuksilla.
    [Arguments]    ${username}    ${password}
    ${body}    Create Dictionary    username=${username}    password=${password}
    ${response}    POST    url=${base_url}/auth/login    json=${body}
    Log    ${response.json()}
    ${token}    Set Variable    ${response.json()}[token]
    Log    ${token}
    Set Suite Variable    ${token}

Update User Information
    [Documentation]    Muokataan käyttäjän tietoja kirjautumisen jälkeen.
    ${headers}    Create Dictionary    Authorization=Bearer ${token}    Content-Type=application/json
    ${body}    Create Dictionary    height=1.8    hr_max=182
    ${response}    PATCH    url=${base_url}/kubios/userinfo    headers=${headers}    json=${body}
    Log    ${response.status_code}
    Log    ${response.json()}
    Should Be Equal As Numbers    ${response.status_code}    200
