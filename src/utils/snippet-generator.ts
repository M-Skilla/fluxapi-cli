import { savedRequest } from "./store";

export function generateSnippet(request: savedRequest, language: string): string {
  const { method = "GET", url, headers = {}, data } = request;

  switch (language.toLowerCase()) {
    case "curl":
      const headerStr = Object.entries(headers)
        .map(([k, v]) => `-H "${k}: ${v}"`)
        .join(" ");
      const dataStr = data ? `-d '${JSON.stringify(data)}'` : "";
      return `curl -X ${method.toUpperCase()} "${url}" ${headerStr} ${dataStr}`.trim();

    case "fetch":
    case "javascript":
      return `fetch("${url}", {
  method: "${method.toUpperCase()}",
  headers: ${JSON.stringify(headers, null, 2)},
  body: ${data ? JSON.stringify(JSON.stringify(data)) : "undefined"}
})`;

    case "axios":
      return `axios({
  method: "${method.toLowerCase()}",
  url: "${url}",
  headers: ${JSON.stringify(headers, null, 2)},
  data: ${data ? JSON.stringify(data, null, 2) : "undefined"}
})`;

    case "python":
    case "requests":
      return `import requests
response = requests.${method.toLowerCase()}(
  "${url}",
  headers=${JSON.stringify(headers, null, 2)},
  data=${data ? JSON.stringify(data) : "None"}
)`;

    case "java":
    case "okhttp":
      const jsonData = data ? JSON.stringify(data).replace(/"/g, '\\"') : "";
      return `OkHttpClient client = new OkHttpClient();

Request request = new Request.Builder()
  .url("${url}")
  .method("${method.toUpperCase()}", RequestBody.create("${jsonData}", MediaType.parse("application/json")))
  .build();

Response response = client.newCall(request).execute();`;

    default:
      return `Language "${language}" not supported yet.`;
  }
}
