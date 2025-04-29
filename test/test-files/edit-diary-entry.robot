*** Settings ***
Library    RequestsLibrary
Library    Collections
Suite Setup    Authenticate user    ${username}    ${password}

*** Variables ***
${username}    elsikubios@gmail.com
${password}    750GmuduMdLX
${base_url}    http://localhost:5000/api
${entry_id}    14

*** Test Cases ***
Update Diary Entry Test
    [Documentation]    Testaa, että päiväkirjamerkinnän tietojen muokkaaminen onnistuu.
    Update Diary Entry

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

Update Diary Entry
    [Documentation]    Muokataan olemassa olevaa päiväkirjamerkintää.
    ${headers}    Create Dictionary    Authorization=Bearer ${token}    Content-Type=application/json
    ${body}    Create Dictionary
    ...    entry_date=2025-04-28
    ...    time_of_day=evening
    ...    sleep_duration=3.5
    ...    sleep_notes=Parempi fiilis
    ...    current_mood=5
    ${url}    Set Variable    ${base_url}/entries/${entry_id}
    ${response}    PUT    url=${url}    headers=${headers}    json=${body}
    Log    ${response.status_code}
    Log    ${response.json()}
    Should Be Equal As Numbers    ${response.status_code}    200
