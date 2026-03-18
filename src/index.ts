export default {
  async fetch(request: Request, env: Env, _ctx: never) {
    const authHeader = request.headers.get('Authorization');

    const expectedToken: string = await env.BEARER_TOKEN_SECRET.get();
    const expectedAuthorization = `Bearer ${expectedToken}`;

    if (authHeader !== expectedAuthorization) {
      return new Response('Unauthorized', { status: 401 });
    }

    const url: URL = new URL(request.url);
    if (url.pathname === '/tailscale') {
      return new Response(await env.TAILSCALE_AUTH_KEY_SECRET.get(), { status: 200 });
    }
    if (url.pathname === '/cloudflare') {
      return new Response(await env.CLOUDFLARE_TUNNEL_TOKEN_SECRET.get(), { status: 200 });
    }
    return new Response('Not Found', { status: 404 });
  },
};
