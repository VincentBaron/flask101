from flask import request, jsonify
from ariadne import make_executable_schema, graphql_sync
from ariadne.explorer import ExplorerGraphiQL
from app import app
from schema import type_defs
from resolvers import query, mutation, user, set_type, like

# Create executable schema
schema = make_executable_schema(
    type_defs,
    [query, mutation, user, set_type, like]
)

# Create Explorer instance
explorer = ExplorerGraphiQL(title="GraphQL API")

@app.route("/graphql", methods=["GET"])
def graphql_playground():
    return explorer.html(url="/graphql"), 200

@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value=request,
        debug=app.debug
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code 