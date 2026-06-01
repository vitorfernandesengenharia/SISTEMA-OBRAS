#!/usr/bin/env python3
"""Servidor local autocontido do MontIA: arquivos estáticos e API persistente."""
from __future__ import annotations

import argparse
import json
import mimetypes
import threading
import webbrowser
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
DATA_FILE = ROOT / "data" / "state.json"
DEFAULT_DATA_FILE = ROOT / "data" / "default-state.json"
LOCK = threading.Lock()
STATIC_FILES = {"/": "index.html", "/index.html": "index.html", "/styles.css": "styles.css", "/script.js": "script.js"}


def read_state() -> dict:
    with LOCK:
        if not DATA_FILE.exists():
            DATA_FILE.write_text(DEFAULT_DATA_FILE.read_text(encoding="utf-8"), encoding="utf-8")
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def write_state(state: dict) -> None:
    with LOCK:
        temporary = DATA_FILE.with_suffix(".tmp")
        temporary.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        temporary.replace(DATA_FILE)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class MontIAHandler(BaseHTTPRequestHandler):
    server_version = "MontIA/1.0"

    def log_message(self, format: str, *args) -> None:
        print(f"[{self.log_date_time_string()}] {format % args}")

    def send_json(self, payload: dict | list, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        if length > 10_000:
            raise ValueError("Requisição muito grande")
        payload = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
        if not isinstance(payload, dict):
            raise ValueError("JSON inválido")
        return payload

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/health":
            self.send_json({"status": "ok", "app": "MontIA"})
            return
        if path == "/api/state":
            self.send_json(read_state())
            return
        file_name = STATIC_FILES.get(path)
        if file_name:
            file_path = ROOT / file_name
            body = file_path.read_bytes()
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", mimetypes.guess_type(file_path.name)[0] or "application/octet-stream")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        self.send_error(HTTPStatus.NOT_FOUND, "Página não encontrada")

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        try:
            payload = self.read_json()
            if path == "/api/messages":
                content = str(payload.get("content", "")).strip()
                if not content:
                    raise ValueError("Digite uma mensagem antes de enviar")
                state = read_state()
                message = {"content": content[:1000], "created_at": now_iso()}
                state["messages"].append(message)
                write_state(state)
                self.send_json(message, HTTPStatus.CREATED)
                return
            if path == "/api/accesses":
                area = str(payload.get("area", "")).strip()
                validity = str(payload.get("validity", "")).strip()
                if not area or not validity:
                    raise ValueError("Informe a área permitida e a validade")
                state = read_state()
                access = {"area": area[:100], "validity": validity[:100], "team": "Equipe Martins", "created_at": now_iso()}
                state["accesses"].append(access)
                write_state(state)
                self.send_json(access, HTTPStatus.CREATED)
                return
            if path == "/api/reset":
                state = read_state()
                state["messages"] = []
                state["accesses"] = []
                write_state(state)
                self.send_json({"status": "reset"})
                return
            self.send_error(HTTPStatus.NOT_FOUND, "Endpoint não encontrado")
        except (ValueError, json.JSONDecodeError) as error:
            self.send_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)


def main() -> None:
    parser = argparse.ArgumentParser(description="Inicia o MontIA no computador local")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=4173, type=int)
    parser.add_argument("--no-browser", action="store_true", help="não abre o navegador automaticamente")
    args = parser.parse_args()
    url = f"http://{args.host}:{args.port}"
    server = ThreadingHTTPServer((args.host, args.port), MontIAHandler)
    print("\nMontIA iniciado com sucesso!")
    print(f"Acesse: {url}")
    print("Para encerrar, feche esta janela ou pressione Ctrl+C.\n")
    if not args.no_browser:
        threading.Timer(0.7, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nMontIA encerrado.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
