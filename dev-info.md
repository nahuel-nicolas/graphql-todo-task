(
{
  project(id: "63f9f68a8865836d9bce5d41") {
    id
  }
}
=>
{
  "data": {
    "project": {
      "id": "63f9f68a8865836d9bce5d41"
    }
  }
}
)

(
{
  project {
    id
  }
}
=>
{
  "data": {
    "project": null
  }
}
)

(
{
  project(id: "63f9f68a8865836d9bce5d41") {
    id, 
    name, 
    client {
      name
    }, 
    __typename
  }
}
=>
{
  "data": {
    "project": {
      "id": "63f9f68a8865836d9bce5d41",
      "name": "Nahuel Nicolas Barbieri",
      "client": {
        "name": "Nahuel Nicolas Barbieri"
      },
      "__typename": "Project"
    }
  }
}
)

(
{
  project(id:"nahuel") {
    id
  }
}
=>
error
)

(
{
  projects {
    id
  }
}
=>
{
  "data": {
    "projects": [
      {
        "id": "63f9f68a8865836d9bce5d41"
      },
      {
        "id": "63f9f7268865836d9bce5d74"
      },
      {
        "id": "63f9f72e8865836d9bce5d77"
      }
    ]
  }
}
)


mutation {
  addClient(name: "tiago", email: "tiago@gmail.com", phone: "1234") {
    id
    name
    email
    phone
  }
}
=>
{
  "data": {
    "addClient": {
      "id": "641f33bc0f2302452e85c5ea",
      "name": "tiago",
      "email": "tiago@gmail.com",
      "phone": "1234"
    }
  }
}