# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — Health Check API Tests
# ==============================================================================

from fastapi.testclient import TestClient


def test_api_health_endpoint(client: TestClient):
    """GET /api/health returns status ok."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_api_v1_health_endpoint(client: TestClient):
    """GET /api/v1/health returns status ok with project and version metadata."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "project" in data
    assert "version" in data
    assert data["project"] == "GenesisConnect API"


def test_root_endpoint(client: TestClient):
    """GET / returns system information and online status."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["client"] == "Genesis Power Equipments Pvt. Ltd."
