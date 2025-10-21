import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///infusions.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "change-me")
app.config["TEMPLATES_AUTO_RELOAD"] = True


db.init_app(app)

with app.app_context():
    # Import models and routes to ensure they are registered
    from . import models, routes  # noqa: F401

    # Create tables if they do not exist
    db.create_all()
