from moss import MossClient
from config import settings

_moss_client: MossClient | None = None

def get_moss() -> MossClient:
    global _moss_client
    if _moss_client is None:
        _moss_client = MossClient(settings.moss_project_id, settings.moss_project_key)
    return _moss_client
