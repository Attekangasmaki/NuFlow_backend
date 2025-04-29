*** Settings ***
Library    RequestsLibrary
Library    Collections
Suite Setup    Authenticate user    ${username}    ${password}

*** Variables ***
${username}    elsikubios@gmail.com
${password}    750GmuduMdLX
${base_url}    http://localhost:5000/api
${preinformation_id}    8

*** Test Cases ***
Update Preinformation Test
    [Documentation]    Testaa, että esitietojen muokkaaminen onnistuu.
    Update Preinformation

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

Update Preinformation
    [Documentation]    Muokataan olemassa olevia esitietoja.
    ${headers}    Create Dictionary    Authorization=Bearer ${token}    Content-Type=application/json
    ${body}    Create Dictionary
    ...    drug_use=Alkanu käyttää kofeiinii
    ...    diseases_medications=Verenpainelääkkeet
    ...    sleep=Ei oo nukkumattii näkyny
    ...    self_assessment=Edelleen nuha polvessa
    ${url}    Set Variable    ${base_url}/metrics/${preinformation_id}
    ${response}    PUT    url=${url}    headers=${headers}    json=${body}
    Log    ${response.status_code}
    Log    ${response.json()}
    Should Be Equal As Numbers    ${response.status_code}    200
