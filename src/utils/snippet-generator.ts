import { savedRequest } from "./store";

export function generateSnippet(
  request: savedRequest,
  language: string
): string {
  const {
    method = "GET",
    url,
    headers = {},
    data,
    queryParams = {},
    authToken,
  } = request;

  // Build URL with query parameters
  const urlObj = new URL(url);
  Object.entries(queryParams).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });
  const fullUrl = urlObj.toString();

  // Add auth token to headers if present
  const allHeaders = { ...headers };
  if (authToken) {
    allHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  switch (language.toLowerCase()) {
    case "curl":
      const headerStr = Object.entries(allHeaders)
        .map(([k, v]) => `-H "${k}: ${v}"`)
        .join(" \\\n  ");
      const dataStr = data ? `-d '${JSON.stringify(data, null, 2)}'` : "";
      return `curl -X ${method.toUpperCase()} \\\n  "${fullUrl}" \\\n  ${headerStr}${
        dataStr ? ` \\\n  ${dataStr}` : ""
      }`.trim();

    case "fetch":
    case "javascript":
      return `fetch("${fullUrl}", {
  method: "${method.toUpperCase()}",
  headers: ${JSON.stringify(allHeaders, null, 2)},
  body: ${data ? JSON.stringify(JSON.stringify(data, null, 2)) : "undefined"}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;

    case "axios":
      return `const axios = require('axios');

axios({
  method: "${method.toLowerCase()}",
  url: "${fullUrl}",
  headers: ${JSON.stringify(allHeaders, null, 2)},
  data: ${data ? JSON.stringify(data, null, 2) : "undefined"}
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error:', error.response?.data || error.message);
});`;

    case "python":
    case "requests":
      const pythonHeaders =
        Object.keys(allHeaders).length > 0
          ? JSON.stringify(allHeaders, null, 4)
          : "{}";
      const pythonData = data ? JSON.stringify(data, null, 4) : "None";
      return `import requests
import json

response = requests.${method.toLowerCase()}(
    "${fullUrl}",
    headers=${pythonHeaders},
    json=${pythonData}
)

if response.status_code == 200:
    print(json.dumps(response.json(), indent=2))
else:
    print(f"Error: {response.status_code}")
    print(response.text)`;

    case "java":
    case "okhttp":
      const jsonData = data
        ? JSON.stringify(data, null, 2).replace(/"/g, '\\"')
        : "";
      const javaHeaders = Object.entries(allHeaders)
        .map(([k, v]) => `  .addHeader("${k}", "${v}")`)
        .join("\n");
      return `import okhttp3.*;
import java.io.IOException;

OkHttpClient client = new OkHttpClient();

${
  data
    ? `MediaType JSON = MediaType.get("application/json; charset=utf-8");
RequestBody body = RequestBody.create("${jsonData}", JSON);`
    : ""
}

Request request = new Request.Builder()
    .url("${fullUrl}")
    .method("${method.toUpperCase()}", ${data ? "body" : "null"})
${javaHeaders}
    .build();

try (Response response = client.newCall(request).execute()) {
    System.out.println(response.body().string());
}`;

    case "go":
    case "golang":
      const goHeaders = Object.entries(allHeaders)
        .map(([k, v]) => `    req.Header.Set("${k}", "${v}")`)
        .join("\n");
      return `package main

import (
    "fmt"
    "net/http"
    "io/ioutil"
    ${data ? '"strings"' : ""}
)

func main() {
    url := "${fullUrl}"
    ${
      data
        ? `payload := strings.NewReader(\`${JSON.stringify(data, null, 2)}\`)`
        : ""
    }
    
    req, err := http.NewRequest("${method.toUpperCase()}", url, ${
        data ? "payload" : "nil"
      })
    if err != nil {
        panic(err)
    }
    
${goHeaders}
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Println(string(body))
}`;

    case "php":
      const phpHeaders = Object.entries(allHeaders)
        .map(([k, v]) => `        '${k}: ${v}'`)
        .join(",\n");
      return `<?php
$url = "${fullUrl}";
${data ? `$data = json_encode(${JSON.stringify(data, null, 4)});` : ""}

$options = [
    'http' => [
        'method' => '${method.toUpperCase()}',
        'header' => [
${phpHeaders}${phpHeaders ? "," : ""}
            'Content-Type: application/json'
        ],
        ${data ? "'content' => $data" : ""}
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

if ($response !== FALSE) {
    $data = json_decode($response, true);
    echo json_encode($data, JSON_PRETTY_PRINT);
} else {
    echo "Error occurred";
}
?>`;

    case "csharp":
    case "c#":
      const csharpHeaders = Object.entries(allHeaders)
        .map(
          ([k, v]) =>
            `            client.DefaultRequestHeaders.Add("${k}", "${v}");`
        )
        .join("\n");
      return `using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

class Program
{
    static async Task Main(string[] args)
    {
        using (var client = new HttpClient())
        {
${csharpHeaders}
            
            var url = "${fullUrl}";
            ${
              data
                ? `var json = JsonConvert.SerializeObject(${JSON.stringify(
                    data,
                    null,
                    12
                  )});
            var content = new StringContent(json, Encoding.UTF8, "application/json");`
                : ""
            }
            
            var response = await client.${
              method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()
            }Async(url${data ? ", content" : ""});
            var responseString = await response.Content.ReadAsStringAsync();
            
            Console.WriteLine(responseString);
        }
    }
}`;

    case "ruby":
      const rubyHeaders = Object.entries(allHeaders)
        .map(([k, v]) => `  '${k}' => '${v}'`)
        .join(",\n");
      return `require 'net/http'
require 'json'

uri = URI('${fullUrl}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true if uri.scheme == 'https'

request = Net::HTTP::${
        method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()
      }.new(uri)
${rubyHeaders ? `request.set_form_data({\n${rubyHeaders}\n})` : ""}
${data ? `request.body = JSON.generate(${JSON.stringify(data, null, 2)})` : ""}

response = http.request(request)
puts JSON.pretty_generate(JSON.parse(response.body))`;

    case "swift":
      const swiftHeaders = Object.entries(allHeaders)
        .map(
          ([k, v]) =>
            `        request.setValue("${v}", forHTTPHeaderField: "${k}")`
        )
        .join("\n");
      return `import Foundation

let url = URL(string: "${fullUrl}")!
var request = URLRequest(url: url)
request.httpMethod = "${method.toUpperCase()}"

${swiftHeaders}

${
  data
    ? `let jsonData = try! JSONSerialization.data(withJSONObject: ${JSON.stringify(
        data,
        null,
        4
      )})
request.httpBody = jsonData`
    : ""
}

let task = URLSession.shared.dataTask(with: request) { data, response, error in
    if let data = data {
        let json = try! JSONSerialization.jsonObject(with: data)
        print(json)
    }
}

task.resume()`;

    case "kotlin":
      return `import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody

val client = OkHttpClient()

${
  data
    ? `val mediaType = "application/json; charset=utf-8".toMediaType()
val body = """${JSON.stringify(data, null, 2)}""".toRequestBody(mediaType)`
    : ""
}

val request = Request.Builder()
    .url("${fullUrl}")
    .${method.toLowerCase()}(${data ? "body" : ""})
    ${Object.entries(allHeaders)
      .map(([k, v]) => `.addHeader("${k}", "${v}")`)
      .join("\n    ")}
    .build()

client.newCall(request).execute().use { response ->
    println(response.body?.string())
}`;

    case "rust":
      return `use reqwest;
use serde_json::Value;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    
    let response = client
        .${method.toLowerCase()}("${fullUrl}")
        ${Object.entries(allHeaders)
          .map(([k, v]) => `.header("${k}", "${v}")`)
          .join("\n        ")}
        ${
          data
            ? `.json(&serde_json::json!(${JSON.stringify(data, null, 8)}))`
            : ""
        }
        .send()
        .await?;
    
    let json: Value = response.json().await?;
    println!("{:#}", json);
    
    Ok(())
}`;

    default:
      return `Language "${language}" not supported yet.
Supported languages: curl, fetch/javascript, axios, python/requests, java/okhttp, go/golang, php, csharp/c#, ruby, swift, kotlin, rust`;
  }
}
