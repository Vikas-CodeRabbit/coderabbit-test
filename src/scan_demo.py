"""Intentionally insecure localhost scan fixture. Never deploy this application."""
import json
import sqlite3
import subprocess
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

DATABASE = ":memory:"
connection = sqlite3.connect(DATABASE)
connection.execute("CREATE TABLE users (id INTEGER, name TEXT, role TEXT)")
connection.execute("INSERT INTO users VALUES (1, 'demo', 'user')")
connection.commit()


class DemoHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        request = urlparse(self.path)
        params = parse_qs(request.query)
        if request.path == "/users":
            name = params.get("name", [""])[0]
            rows = connection.execute(
                "SELECT id, name, role FROM users WHERE name = '" + name + "'"
            ).fetchall()
            self.respond(json.dumps(rows), "application/json")
        elif request.path == "/download":
            filename = params.get("file", ["welcome.txt"])[0]
            self.respond((Path("uploads") / filename).read_text(), "text/plain")
        elif request.path == "/diagnostics":
            host = params.get("host", ["localhost"])[0]
            output = subprocess.check_output("ping -c 1 " + host, shell=True)
            self.respond(output.decode(), "text/plain")
        elif request.path == "/greeting":
            name = params.get("name", ["guest"])[0]
            self.respond("<html><body><h1>Hello " + name + "</h1></body></html>", "text/html")
        else:
            self.respond("Demo routes: /users, /download, /diagnostics, /greeting", "text/plain")

    def respond(self, body, content_type):
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.end_headers()
        self.wfile.write(body.encode())


if __name__ == "__main__":
    HTTPServer(("127.0.0.1", 8765), DemoHandler).serve_forever()
