# 🚀 FluxAPI CLI

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-brightgreen.svg)](https://nodejs.org/)
[![npm version](https://img.shields.io/npm/v/fluxapi-cli.svg)](https://www.npmjs.com/package/fluxapi-cli)

A lightweight, cross-platform command-line interface for interacting with APIs. Built as a companion to the FluxAPI Desktop client, it allows developers and testers to send HTTP requests, inspect responses, and manage API workflows directly from the terminal.

## ✨ Features

- 🔄 **Send HTTP Requests** - Support for all HTTP methods (GET, POST, PUT, DELETE, etc.)
- 💾 **Save & Manage Requests** - Store frequently used requests for quick access
- 🎨 **Beautiful Output** - Colored JSON responses and status codes
- 📋 **Code Generation** - Export saved requests as code snippets in 12+ languages
- 🔐 **Authentication Support** - Bearer token authentication
- 📝 **Query Parameters & Headers** - Full support for custom headers and query parameters
- 🎯 **Environment Variables** - Support for environment-based authentication
- 📋 **Clipboard Integration** - Copy generated code snippets to clipboard

## 🛠 Installation

### Global Installation (Recommended)

```bash
npm install -g fluxapi-cli
```

### Using pnpm

```bash
pnpm add -g fluxapi-cli
```

### Using yarn

```bash
yarn global add fluxapi-cli
```

## 🚀 Quick Start

### Basic HTTP Request

```bash
# Simple GET request
fluxapi req https://jsonplaceholder.typicode.com/posts/1

# POST request with JSON data
fluxapi req https://jsonplaceholder.typicode.com/posts \
  -m POST \
  -H "Content-Type=application/json" \
  -b '{"title": "My Post", "body": "Hello World", "userId": 1}'
```

### Save & Reuse Requests

```bash
# Save a request configuration
fluxapi save myapi https://api.example.com/users \
  -m GET \
  -H "Authorization=Bearer your-token" \
  -q "limit=10&page=1"

# Use saved request
fluxapi req @myapi

# List all saved requests
fluxapi list

# Delete a saved request
fluxapi delete myapi
```

### Generate Code Snippets

```bash
# Export as curl command
fluxapi export myapi --language curl

# Export as Python requests code
fluxapi export myapi -l python --copy

# Export as JavaScript fetch
fluxapi export myapi -l javascript
```

## 📖 Command Reference

### `fluxapi req <url>` - Send HTTP Request

Send an HTTP request to the specified URL or use a saved request.

**Usage:**

```bash
fluxapi req <url|@saved-name> [options]
```

**Arguments:**

- `<url>` - URL to send the request to, or `@name` to use a saved request

**Options:**

- `-m, --method <method>` - HTTP method (GET, POST, PUT, DELETE, etc.) [default: "GET"]
- `-H, --header <header...>` - Headers in `key=value` format (can be used multiple times)
- `-q, --query <query...>` - Query parameters in `key=value` format (can be used multiple times)
- `-b, --body <body>` - Request body (JSON string)
- `-t, --token <token>` - Bearer authentication token

**Examples:**

```bash
# GET request
fluxapi req https://api.github.com/users/octocat

# POST with JSON body
fluxapi req https://httpbin.org/post \
  -m POST \
  -H "Content-Type=application/json" \
  -b '{"name": "John", "age": 30}'

# With authentication
fluxapi req https://api.example.com/protected \
  -H "Authorization=Bearer your-token"

# With query parameters
fluxapi req https://api.example.com/search \
  -q "q=javascript" \
  -q "sort=stars"

# Use saved request
fluxapi req @myapi
```

### `fluxapi save <name> <url>` - Save Request Configuration

Save a request configuration for future use.

**Usage:**

```bash
fluxapi save <name> <url> [options]
```

**Arguments:**

- `<name>` - Name to save the request under
- `<url>` - URL to send the request to

**Options:**

- `-m, --method <method>` - HTTP method [default: "GET"]
- `-H, --header <header...>` - Headers in `key=value` format
- `-q, --query <query...>` - Query parameters in `key=value` format
- `-b, --body <body>` - Request body (JSON string)
- `-t, --token <token>` - Bearer authentication token

**Examples:**

```bash
# Save a simple GET request
fluxapi save github-user https://api.github.com/users/octocat

# Save a complex POST request
fluxapi save create-post https://jsonplaceholder.typicode.com/posts \
  -m POST \
  -H "Content-Type=application/json" \
  -H "Authorization=Bearer token123" \
  -b '{"title": "My Post", "body": "Content", "userId": 1}'

# Save with query parameters
fluxapi save search-repos https://api.github.com/search/repositories \
  -q "q=javascript" \
  -q "sort=stars" \
  -q "order=desc"
```

### `fluxapi list` - List Saved Requests

Display all saved request configurations.

**Usage:**

```bash
fluxapi list
```

**Example:**

```bash
$ fluxapi list
Saved Requests:
- github-user
- create-post
- search-repos
```

### `fluxapi delete <name>` - Delete Saved Request

Delete a saved request configuration.

**Usage:**

```bash
fluxapi delete <name>
```

**Arguments:**

- `<name>` - Name of the saved request to delete

**Example:**

```bash
fluxapi delete github-user
```

### `fluxapi export <name>` - Export Code Snippets

Export a saved request as a code snippet in various programming languages.

**Usage:**

```bash
fluxapi export <name> [options]
```

**Arguments:**

- `<name>` - Name of the saved request

**Options:**

- `-l, --language <lang>` - Target language/framework [default: "curl"]
- `--copy` - Copy the generated snippet to clipboard

**Supported Languages:**

- `curl` - cURL command
- `fetch` / `javascript` - JavaScript Fetch API
- `axios` - JavaScript Axios library
- `python` / `requests` - Python requests library
- `java` / `okhttp` - Java OkHttp library
- `go` / `golang` - Go net/http package
- `php` - PHP with file_get_contents
- `csharp` / `c#` - C# HttpClient
- `ruby` - Ruby Net::HTTP
- `swift` - Swift URLSession
- `kotlin` - Kotlin OkHttp
- `rust` - Rust reqwest library

**Examples:**

```bash
# Export as cURL (default)
fluxapi export myapi

# Export as Python requests
fluxapi export myapi -l python

# Export as JavaScript and copy to clipboard
fluxapi export myapi -l javascript --copy

# Export as Go code
fluxapi export myapi -l go
```

## 🔐 Authentication

### Bearer Token Authentication

You can provide authentication tokens in several ways:

1. **Via command line option:**

```bash
fluxapi req https://api.example.com/protected -t "your-token-here"
```

2. **Via environment variable:**

```bash
export AUTH_TOKEN="your-token-here"
fluxapi req https://api.example.com/protected
```

3. **Save in request configuration:**

```bash
fluxapi save protected-api https://api.example.com/protected -t "your-token-here"
fluxapi req @protected-api
```

### Custom Headers

For other authentication methods, use custom headers:

```bash
# API Key authentication
fluxapi req https://api.example.com/data -H "X-API-Key=your-api-key"

# Basic authentication (base64 encoded)
fluxapi req https://api.example.com/data -H "Authorization=Basic dXNlcjpwYXNz"

# Custom token format
fluxapi req https://api.example.com/data -H "X-Auth-Token=your-custom-token"
```

## 🎨 Response Formatting

FluxAPI CLI provides beautiful, colored output for API responses:

- **Status Codes**: Color-coded by status (green for 2xx, yellow for 3xx, red for 4xx, etc.)
- **JSON Responses**: Syntax highlighted and pretty-printed
- **Error Messages**: Clear error formatting with helpful details

## 📂 Configuration Storage

FluxAPI CLI stores your saved requests in a local configuration file using the `conf` package. The configuration is stored in:

- **Linux/macOS**: `~/.config/fluxapi/config.json`
- **Windows**: `%APPDATA%/fluxapi/config.json`

## 🔧 Advanced Usage

### Complex JSON Bodies

For complex JSON bodies, you can use files:

```bash
# Save JSON to a file
echo '{"complex": {"nested": "data"}}' > body.json

# Use the file content
fluxapi req https://api.example.com/complex -m POST -b "$(cat body.json)"
```

### Multiple Headers and Query Parameters

```bash
fluxapi req https://api.example.com/data \
  -H "Content-Type=application/json" \
  -H "Accept=application/json" \
  -H "User-Agent=MyApp/1.0" \
  -q "page=1" \
  -q "limit=50" \
  -q "sort=name"
```

### Environment-Based Workflows

```bash
# Set base URL and token via environment
export API_BASE="https://api.staging.example.com"
export AUTH_TOKEN="staging-token-123"

# Use in requests
fluxapi req $API_BASE/users
fluxapi save staging-users $API_BASE/users -t $AUTH_TOKEN
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Issues**: [GitHub Issues](https://github.com/M-Skilla/fluxapi-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/M-Skilla/fluxapi-cli/discussions)
- **Email**: [your-email@example.com]

## 🏆 Acknowledgments

- Built with [Commander.js](https://github.com/tj/commander.js) for CLI framework
- Uses [Axios](https://axios-http.com/) for HTTP requests
- Powered by [Chalk](https://github.com/chalk/chalk) for beautiful terminal output
- JSON highlighting by [json-colorizer](https://github.com/fourcube/json-colorizer)

---

**Made with ❤️ by [M-Skilla](https://github.com/M-Skilla)**
