#!/usr/bin/env python3
"""Yusu-Begleit-App lokal starten: liefert die Website aus und reicht das Gespräch an Ollama weiter.

    python3 yusu/lokal.py            nur dieser Rechner:  http://localhost:8766/yusu/
    python3 yusu/lokal.py --lan      auch Handy im selben WLAN (Adresse wird angezeigt)

Weitergereicht werden nur zwei Ollama-Aufrufe (Modelle auflisten, Gespräch). Ollama selbst bleibt auf
127.0.0.1. Mit --lan kann jedes Gerät im selben Netz die App und das Sprachmodell benutzen, solange das
Skript läuft – nur im eigenen Netz verwenden. Der Roboter selbst hat damit nichts zu tun (der bleibt offline).

Hinweis: Mikrofon und "Bildschirm anlassen" erlaubt der Browser nur über https oder localhost, also nicht
über die WLAN-Adresse. Tippen und Vorlesen gehen dort trotzdem."""
import argparse
import http.server
import os
import socket
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))      # Website-Ordner
OLLAMA = "http://127.0.0.1:11434"
ALLOWED = {("GET", "/ollama/api/tags"), ("POST", "/ollama/api/chat")}
MAX_BODY = 512 * 1024


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")                   # beim Entwickeln nie alte Dateien
        super().end_headers()

    def do_GET(self):
        if self.path.startswith("/ollama/"):
            return self._proxy("GET")
        return super().do_GET()

    def do_POST(self):
        return self._proxy("POST")

    def _proxy(self, method):
        path = self.path.split("?", 1)[0]
        if (method, path) not in ALLOWED:
            return self.send_error(404)
        data = None
        if method == "POST":
            try:
                length = int(self.headers.get("Content-Length") or 0)
            except ValueError:
                length = 0
            if length <= 0 or length > MAX_BODY:
                return self.send_error(413)
            data = self.rfile.read(length)
        req = urllib.request.Request(OLLAMA + path[len("/ollama"):], data=data, method=method,
                                     headers={"Content-Type": "application/json"})
        try:
            upstream = urllib.request.urlopen(req, timeout=120)
        except urllib.error.HTTPError as ex:
            return self.send_error(ex.code)
        except OSError:
            return self.send_error(502, "Ollama nicht erreichbar")
        with upstream:
            self.send_response(upstream.status)
            self.send_header("Content-Type", upstream.headers.get("Content-Type", "application/json"))
            self.send_header("Connection", "close")
            self.end_headers()
            self.close_connection = True
            try:
                for line in upstream:                                   # Antwort Zeile für Zeile durchreichen
                    self.wfile.write(line)
                    self.wfile.flush()
            except (BrokenPipeError, ConnectionResetError):
                pass                                                    # Browser hat abgebrochen (Unterbrechung)

    def log_message(self, fmt, *args):
        if self.path.startswith("/ollama/"):
            super().log_message(fmt, *args)


def lan_address():
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        try:
            s.connect(("192.0.2.1", 9))                                 # schickt nichts, ermittelt nur die eigene Adresse
            return s.getsockname()[0]
        except OSError:
            return None


def main():
    ap = argparse.ArgumentParser(description="Yusu-Begleit-App lokal starten")
    ap.add_argument("--port", type=int, default=8766)
    ap.add_argument("--lan", action="store_true", help="auch für andere Geräte im selben Netz erreichbar")
    args = ap.parse_args()
    host = "0.0.0.0" if args.lan else "127.0.0.1"
    server = http.server.ThreadingHTTPServer((host, args.port), Handler)
    print(f"Yusu-App: http://localhost:{args.port}/yusu/")
    if args.lan:
        ip = lan_address()
        print(f"Im WLAN:  http://{ip}:{args.port}/yusu/" if ip else "Im WLAN:  Adresse nicht gefunden")
        print("Achtung: Solange das läuft, ist das Sprachmodell für alle Geräte in diesem Netz erreichbar.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print()


if __name__ == "__main__":
    main()
