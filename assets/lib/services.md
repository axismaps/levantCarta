We need 3 models:

- user
- change-set
- change

### user model:

```
{
    id: id,
    email: "",
    password: ""
}

```

### change-set model:

```
{
  "id": 1,
  "type": "",
  "title": "",
  "submittedBy": <user>,
  "createAt": "",
  "changes": [<changes>]
}
```

### change model:

```
{
  "id": 1,
  "createAt": "",
  "layer": "",
  "approvedStatus": false,
  "editType": "",
  "submittedBy": <user>,
  "comments": [],
  "originalFeature": {},
  "newFeature": {}
}
```

### End points:

#### user

```
CREATE /api/user/
GET /api/user/:id
DELL /api/user/:id
PATCH /api/user/:id
```

#### change-set

```
CREATE /api/change-set/
GET /api/change-set/:id
FIND /api/change-set/ //I think we can just return all change-sets, dont need to query, dont know if will be that many change-sets
DELL /api/change-set/:id
PATCH /api/change-set/:id
```

#### change

```
CREATE /api/change-set/
GET /api/change-set/:id
FIND /api/change-set/q:[ids]
DELL /api/change-set/:id
PATCH /api/change-set/:id
```

We will also need a 4º model to store comments, but I didn't start working on it yet. I not sure how its going to be.
