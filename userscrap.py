

#CODE FOR GETTING DETAILS OF MULTIPLE  USER (Here is code for some id) 
import requests
import json

url = "https://widget-api.socion.io/openwidgetapi"

# List of practitioner IDs
practitioner_ids = [
   
    '4f8fe22c-8dae-468f-b003-f41e1abdf485',
    'e348c20d-c7e1-460f-9ec7-15f268dc9d11',
    '7e5a3a66-53b3-4a9e-a4af-da77b6e53614',
    'fa1e92ec-093e-4b52-b2df-8f16d10203e2',
    '3ca8d21c-b8f7-412b-85d0-77aa2d49a81a',
    '2cbf38a3-d533-4451-9b58-f523baba5fe5',
    'c0072a31-91df-48a0-b79e-5d19c7d29d27',
    '0a59ae48-1c58-4c3f-9d94-5339ab7c0944',
    'e3867d63-96d5-4a20-9b9a-844063372dd5',
    '0b7a3d60-9092-40ff-9c4b-73daede8e2b9',
    'bc2d9734-3b59-4c4d-a8c2-9e543180c372',
    '8610e640-1fe5-43f1-8552-f0964cc48dc4'

          
]

headers = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'en,en-US;q=0.9',
  'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGZ2JkZGQ3SmhHZ05xa3I0b1ljVGtVZnVyLTk5OGQxRUtQRWJWeXl3RGE4In0.eyJleHAiOjE3NTA3MzUxMzcsImlhdCI6MTcxOTE5OTEzNywianRpIjoiYmJhOThhNzItNmIwMC00YWQ0LTk2NWUtOGJmN2ZkYTU4NjY4IiwiaXNzIjoiaHR0cHM6Ly9wZGEuc29jaW9uLmlvL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIwM2EzODg2MC0wOTJhLTQ0MmEtYmI5NC00M2EwYjU5ODdiZjciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1jbGkiLCJzZXNzaW9uX3N0YXRlIjoiNjMwMTg4ODEtYWNmZi00MDMyLTk0Y2UtZjg2YzI3Mjc4MDZmIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJBY3RpdmUyIHByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJLYW5pc2hrYSAgUGF0d2EiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI2Mzc2NTM3NzY4IiwiZ2l2ZW5fbmFtZSI6IkthbmlzaGthICBQYXR3YSJ9.ZuaBzW2t8Spra1wW4BxT0jzU9FKCJ5sT1PQ4VU4VirWcJa7ypqCcXD4ANGcIwOaFoCPzlVcROoE6Z0YvRUwymKsw1rR75HM6hb6L-kVluLvddGtuVtrNUwqP8uk0vHBADjdIksbId698nLbKsPRu9NreYEtAwoqWoz_pvshAHhyVvR3X55lWIER4Nf_PBuK5M2W9_RLJ-xFCU6-nXKg7HuqDKep-iE6oGVY6wBvC0IjpD1zM_ucgBZqkubhBHGueQP6b9aEQjYhqL6pUWwMSA8UN9xOEVtbW-cXx1ECRKqjZad9YYk0x_FpNVeAVe6K0JA0Td8zTVeMXVI-sHo8KnQ',
  'content-type': 'application/json',
  'origin': 'https://widget.socion.io',
  'priority': 'u=1, i',
  'referer': 'https://widget.socion.io/',
  'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
}

for practitioner_id in practitioner_ids:
    payload = {
        "query": "{ userDetailData(practitionerId: \"%s\", programId: 27, userId: \"%s\", isPrivateUser: true) { userId emailId country state city photo name phoneNumber district programId latitude userRole longitude badgeDetails { badgeId badgeName } traineeData { topicName issuedDate } trainerData { topicName issuedDate } roleTitle qualificationTitle } }" % (practitioner_id, practitioner_id),
        "variables": {}
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    print(f"Response for practitioner ID {practitioner_id}:")
    print(response.text)
    print("\n")
