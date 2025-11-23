"""Jupyter Server handler exposing Google OAuth state to the frontend."""

from __future__ import annotations

import json
import os
from typing import Any, Dict

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado.web


class GoogleAuthStateHandler(APIHandler):
    """Return Google OAuth info stored in the user environment."""

    @tornado.web.authenticated
    def get(self):
        payload: Dict[str, Any] = {
            "email": os.environ.get("GOOGLE_ACCOUNT_EMAIL"),
            "access_token": os.environ.get("GOOGLE_ACCESS_TOKEN"),
            "refresh_token": os.environ.get("GOOGLE_REFRESH_TOKEN"),
            "id_token": os.environ.get("GOOGLE_ID_TOKEN"),
        }

        raw_state = os.environ.get("GOOGLE_AUTH_STATE_JSON")
        if raw_state:
            try:
                payload["raw"] = json.loads(raw_state)
            except json.JSONDecodeError:
                payload["raw"] = raw_state

        self.finish(payload)


def setup_handlers(server_app):
    """Register the API handler."""
    base_url = server_app.web_app.settings.get("base_url", "/")
    pattern = url_path_join(base_url, "google-auth-state")
    server_app.web_app.add_handlers(".*$", [(pattern, GoogleAuthStateHandler)])


def _load_jupyter_server_extension(server_app):
    setup_handlers(server_app)


def _jupyter_server_extension_paths():
    return [{"module": "jupyterlab_examples_main_menu.handlers"}]

