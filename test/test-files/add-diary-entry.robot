*** Settings ***
Library    RequestsLibrary
Library    Collections
Suite Setup    Authenticate user    ${username}    ${password}

*** Variables ***
${username}    elsikubios@gmail.com
${password}    750GmuduMdLX
${base_url}    http://localhost:5000/api

*** Test Cases ***
Insert Diary Entry Test
    [Documentation]    Testaa, että päiväkirjamerkinnän lisääminen onnistuu kirjautumisen jälkeen.
    Insert Diary Entry

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

Insert Diary Entry
    [Documentation]    Syötetään uusi päiväkirjamerkintä palveluun.
    ${headers}    Create Dictionary    Authorization=Bearer ${token}    Content-Type=application/json
    ${body}    Create Dictionary
    ...    entry_date=2025-04-28
    ...    time_of_day=morning
    ...    sleep_duration=2.5
    ...    sleep_notes=tosi kiva fiilis
    ...    current_mood=4
    ...    activity=Lenkillä kävin tossa
    ${response}    POST    url=${base_url}/entries/insert    headers=${headers}    json=${body}
    Log    ${response.status_code}
    Log    ${response.json()}
    Should Be Equal As Numbers    ${response.status_code}    201
