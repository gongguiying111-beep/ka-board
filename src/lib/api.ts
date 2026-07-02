const BASE = "/api/projects";

async function request(method: string, body?: any, id?: string) {
  const url = id ? `${BASE}?id=${id}` : BASE;
  const opts: RequestInit = { method };
  if (body) {
    opts.headers = { "Content-Type": "application/json" };
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  return res.json();
}

export const api = {
  from(_table: string) {
    return {
      select(_columns: string) {
        return {
          async order(col: string, _opts: { ascending: boolean }) {
            return request("GET");
          },
        };
      },
      insert(data: any) {
        return {
          select() {
            return {
              async single() {
                const result = await request("POST", data);
                return { data: result.data, error: result.error };
              },
            };
          },
        };
      },
      update(data: any) {
        return {
          async eq(_col: string, id: string) {
            const result = await request("PATCH", { ...data, id });
            return { error: result.error };
          },
        };
      },
      delete() {
        return {
          async eq(_col: string, id: string) {
            const result = await request("DELETE", undefined, id);
            return { error: result.error };
          },
        };
      },
    };
  },
};
