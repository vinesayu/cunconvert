export async function onRequest(context) {
  const authHeader = context.request.headers.get("authorization");
  const user = context.env.BASIC_AUTH_USER || "admin"; // 默认用户名
  const pass = context.env.BASIC_AUTH_PASSWORD || "";   // 读取Cloudflare后台的密码

  // 如果没提供密码，或者密码不对，就弹出浏览器的输入框
  if (!authHeader || !verify(authHeader, user, pass)) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Private Site"',
      },
    });
  }

  // 密码正确，放行
  return context.next();
}

// 内部验证函数
function verify(header, user, pass) {
  try {
    if (!header.startsWith("Basic ")) return false;
    const [u, p] = atob(header.slice(6)).split(":", 2);
    return u === user && p === pass;
  } catch (error) {
    return false;
  }
}
