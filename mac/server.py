"""Крошечный сервер на Mac: отдаёт надпись для сайта.

Слушает только 127.0.0.1 (снаружи к нему ходит лишь туннель Cloudflare).
  /      — та же страница, что на GitHub Pages (надпись по центру);
  /text  — только текст надписи; его забирает страница на GitHub Pages.
"""
import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

TEXT = "охуенный сайт"
ALLOWED_ORIGIN = "https://ijpteb.github.io"

PAGE = f"""<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{TEXT}</title>
<style>
  html, body {{ height: 100%; margin: 0; }}
  body {{ display: grid; place-items: center; background: #fff; color: #111;
         font: 600 clamp(28px, 8vw, 96px)/1.1 -apple-system, system-ui, sans-serif;
         text-align: center; }}
  @media (prefers-color-scheme: dark) {{ body {{ background: #000; color: #fff; }} }}
</style>
</head>
<body>{TEXT}</body>
</html>
"""


class Handler(BaseHTTPRequestHandler):
    def _send(self, body: str, ctype: str):
        data = body.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", f"{ctype}; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(data)

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path == "/text":
            self._send(TEXT, "text/plain")
        elif path == "/":
            self._send(PAGE, "text/html")
        else:
            self.send_error(404)

    do_HEAD = do_GET

    def log_message(self, fmt, *args):  # без журнала запросов
        pass


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--port", type=int, default=8790)
    port = p.parse_args().port
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()


if __name__ == "__main__":
    main()
