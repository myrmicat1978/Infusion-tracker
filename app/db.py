from __future__ import annotations

import os
from contextlib import contextmanager
from typing import Iterator

from sqlmodel import Session, SQLModel, create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/antiamyloid.db")

engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})


def init_db() -> None:
    # Ensure sqlite directory exists if using a file path
    if DATABASE_URL.startswith("sqlite"):
        try:
            path_part = DATABASE_URL.split("///", 1)[1]
            dir_path = os.path.dirname(path_part)
            if dir_path and not os.path.exists(dir_path):
                os.makedirs(dir_path, exist_ok=True)
        except Exception:
            # Best-effort directory creation; continue to table creation
            pass
    SQLModel.metadata.create_all(engine)


@contextmanager
def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session
