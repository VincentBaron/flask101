# Flask GraphQL API

This is a Flask-based GraphQL API that provides functionality for managing users, sets, and likes.

## Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Initialize the database:

```bash
flask db init
flask db migrate
flask db upgrade
```

5. Run the application:

```bash
flask run
```

The GraphQL playground will be available at `http://localhost:5000/graphql`

## API Features

- User Management
  - Create users
  - Query users
- Set Management
  - Create sets
  - Query sets
- Like System
  - Like/unlike sets
  - Query likes

## GraphQL Examples

### Query Users

```graphql
query {
  users {
    id
    email
    username
    sets {
      id
      title
    }
  }
}
```

### Create User

```graphql
mutation {
  createUser(
    email: "user@example.com"
    password: "password123"
    username: "username"
  ) {
    id
    email
    username
  }
}
```

### Create Set

```graphql
mutation {
  createSet(title: "My Set", description: "Description", userId: "1") {
    id
    title
    description
    user {
      username
    }
  }
}
```
