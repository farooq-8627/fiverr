export function json<T = any>(object: T, init?: ResponseInit): Response {
  return new Response(JSON.stringify(object), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      ...init?.headers,
    },
    ...init,
  });
}

export function ok(init?: ResponseInit): Response {
  return new Response("OK", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      ...init?.headers,
    },
    ...init,
  });
}

export function error(
  message: string,
  status = 400,
  init?: ResponseInit
): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      ...init?.headers,
    },
    ...init,
  });
}

export function notFound(init?: ResponseInit): Response {
  return error("Not Found", 404, init);
}
