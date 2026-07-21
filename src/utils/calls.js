function Get(url, params = {}, headers = {}) {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  return fetch(fullUrl, { method: "GET", headers });
}

function Post(url, body = {}, headers = {}) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function Put(url, body = {}, headers = {}) {
  return fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function Delete(url, headers = {}) {
  return fetch(url, {
    method: "DELETE",
    headers,
  });
}

export { Get, Post, Put, Delete };
