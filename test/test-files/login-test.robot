*** Settings ***
Library    RequestsLibrary
Library    Collections
Suite Setup    Authenticate user    ${username}    ${password}   # Anna argumentit

*** Variables ***
${username}    elsikubios@gmail.com
${password}    750GmuduMdLX

*** Test Cases ***
Valid Login Test
    [Documentation]    Testaa, että sisäänkirjautuminen onnistuu oikeilla tunnuksilla.
    Authenticate user    ${username}    ${password}

*** Keywords ***
Authenticate user
    [Documentation]  Kirjaudutaan sisään ylläpitäjän oikeuksilla.
    [Arguments]    ${username}    ${password}    # Tämä määrittelee argumentit
    ${body}    Create Dictionary    username=${username}    password=${password}
    ${response}    POST    url=http://localhost:5000/api/auth/login    json=${body}
    Log    ${response.json()}
    ${token}    Set Variable    ${response.json()}[token]
    Log    ${token}
    Set Suite Variable    ${token}
