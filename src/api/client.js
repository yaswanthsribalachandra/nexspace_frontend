const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
"https://nexspacebackend-b7d3eyc7dfdzfvda.centralindia-01.azurewebsites.net/";

class ApiClient {
  getToken() {
    return localStorage.getItem(
      "token"
    );
  }

  async request(
    endpoint,
    method,
    body
  ) {
    const headers = {
      "Content-Type":
        "application/json",
    };

    const token =
      this.getToken();

    if (token) {
      headers[
        "Authorization"
      ] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        method,
        headers,
        body: body
          ? JSON.stringify(body)
          : undefined,
      }
    );

    if (!response.ok) {
      const error =
        await response
          .json()
          .catch(() => ({}));

      throw new Error(
        error.detail ||
          "API Error"
      );
    }

    if (
      response.status === 204
    ) {
      return null;
    }

    return response.json();
  }

  // AUTH
  async register(
    email,
    password,
    full_name
  ) {
    return this.request(
      "/api/auth/register",
      "POST",
      {
        email,
        password,
        full_name,
      }
    );
  }

  async login(
    email,
    password
  ) {
    return this.request(
      "/api/auth/login",
      "POST",
      {
        email,
        password,
      }
    );
  }

  async getMe() {
    return this.request(
      "/api/auth/me",
      "GET"
    );
  }

  // LINKS
  async createLink(link) {
    return this.request(
      "/api/links",
      "POST",
      link
    );
  }

  async getLinks() {
    return this.request(
      "/api/links",
      "GET"
    );
  }

  async getLink(id) {
    return this.request(
      `/api/links/${id}`,
      "GET"
    );
  }

  async updateLink(
    id,
    link
  ) {
    return this.request(
      `/api/links/${id}`,
      "PUT",
      link
    );
  }

  async deleteLink(id) {
    return this.request(
      `/api/links/${id}`,
      "DELETE"
    );
  }

  async searchLinks(query) {
    return this.request(
      `/api/links/search?q=${encodeURIComponent(
        query
      )}`,
      "GET"
    );
  }

  async getStats() {
    return this.request(
      "/api/stats",
      "GET"
    );
  }
}

export const apiClient =
  new ApiClient();