*** Settings ***
Library    RequestsLibrary
Library    Collections
Suite Setup    Authenticate user    ${username}    ${password}

*** Variables ***
${username}    elsikubios@gmail.com
${password}    750GmuduMdLX
${base_url}    http://localhost:5000/api

*** Test Cases ***
Insert Preinformation Test
    [Documentation]    Testaa, että esitietojen syöttäminen onnistuu kirjautumisen jälkeen.
    Insert Preinformation

*** Keywords ***
Authenticate user
    [Documentation]    Kirjaudutaan sisään ja tallennetaan token.
    [Arguments]    ${username}    ${password}
    ${body}    Create Dictionary    username=${username}    password=${password}
    ${response}    POST    url=${base_url}/auth/login    json=${body}
    Log    ${response.json()}
    ${token}    Set Variable    ${response.json()}[token]
    Log    ${token}
    Set Suite Variable    ${token}

Insert Preinformation
    [Documentation]    Syötetään esitiedot palveluun.
    ${headers}    Create Dictionary    Authorization=Bearer ${token}    Content-Type=application/json
    ${body}    Create Dictionary
    ...    drug_use=EN käytä midiksii
    ...    diseases_medications=En käytä lääkkeitäkään
    ...    sleep=Hyvin tullu nukuttuu täs viimeaikoin
    ...    self_assessment=Nuha polvessa
    ${response}    POST    url=${base_url}/metrics/insert    headers=${headers}    json=${body}
    Log    ${response.status_code}
    Log    ${response.json()}
    Should Be Equal As Numbers    ${response.status_code}    201
