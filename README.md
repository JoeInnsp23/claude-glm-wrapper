# Claude-GLM Wrapper

Use [Z.AI's GLM models](https://z.ai) with [Claude Code](https://www.anthropic.com/claude-code) — **without losing your existing Claude setup!**

Switch freely between multiple AI providers: GLM, OpenAI, Gemini, OpenRouter, and Anthropic Claude.

## Why This Wrapper?

**💰 Cost-effective**: Access to multiple providers with competitive pricing
**🔄 Risk-free**: Your existing Claude Code setup remains completely untouched
**⚡ Multiple options**: Two modes - dedicated wrappers or multi-provider proxy
**🔀 In-session switching**: With ccx, switch models without restarting
**🎯 Perfect for**: Development, testing, or when you want model flexibility

## Quick Start

### Universal Installation (All Platforms)

**One command works everywhere - Windows, macOS, and Linux:**

```bash
npx claude-glm-installer
```

Then activate (platform-specific):
```bash
# macOS / Linux:
source ~/.zshrc  # or ~/.bashrc

# Windows PowerShell:
. $PROFILE
```

### Start Using GLM Models

**All Platforms:**
```bash
ccg              # Claude Code with GLM-4.6 (latest)
ccg45            # Claude Code with GLM-4.5
ccf              # Claude Code with GLM-4.5-Air (faster)
cc               # Regular Claude Code
```

That's it! 🎉

---

### Alternative: Platform-Specific Installers

<details>
<summary>Click to expand platform-specific installation methods</summary>

#### macOS / Linux

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/JoeInnsp23/claude-glm-wrapper/main/install.sh)
source ~/.zshrc  # or ~/.bashrc
```

#### Windows (PowerShell)

```powershell
iwr -useb https://raw.githubusercontent.com/JoeInnsp23/claude-glm-wrapper/main/install.ps1 | iex
. $PROFILE
```

</details>

## Features

- 🚀 **Easy switching** between GLM and Claude models
- ⚡ **Multiple GLM models**: GLM-4.6 (latest), GLM-4.5, and GLM-4.5-Air (fast)
- 🔒 **No sudo/admin required**: Installs to user's home directory
- 🖥️ **Cross-platform**: Works on Windows, macOS, and Linux
- 📁 **Isolated configs**: Each model uses its own config directory — no conflicts!
- 🔧 **Shell aliases**: Quick access with simple commands

## Prerequisites

1. **Node.js** (v14+): For npx installation - [nodejs.org](https://nodejs.org/)
2. **Claude Code**: Install from [anthropic.com/claude-code](https://www.anthropic.com/claude-code)
3. **Z.AI API Key**: Get your free key from [z.ai/manage-apikey/apikey-list](https://z.ai/manage-apikey/apikey-list)

*Note: If you don't have Node.js, you can use the platform-specific installers (see Quick Start above)*

## Installation

### Method 1: npx (Recommended - All Platforms)

**One command for Windows, macOS, and Linux:**

```bash
npx claude-glm-installer
```

The installer will:
- Auto-detect your operating system
- Check if Claude Code is installed
- Ask for your Z.AI API key
- Create platform-appropriate wrapper scripts
- Add convenient aliases to your shell/profile

After installation, **activate the changes**:

```bash
# macOS / Linux:
source ~/.zshrc  # or ~/.bashrc

# Windows PowerShell:
. $PROFILE
```

### Method 2: Platform-Specific Installers

<details>
<summary>macOS / Linux</summary>

**One-Line Install:**
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/JoeInnsp23/claude-glm-wrapper/main/install.sh)
source ~/.zshrc  # or ~/.bashrc
```

**Clone and Install:**
```bash
git clone https://github.com/JoeInnsp23/claude-glm-wrapper.git
cd claude-glm-wrapper
bash install.sh
source ~/.zshrc
```

</details>

<details>
<summary>Windows (PowerShell)</summary>

**One-Line Install:**
```powershell
iwr -useb https://raw.githubusercontent.com/JoeInnsp23/claude-glm-wrapper/main/install.ps1 | iex
. $PROFILE
```

**Clone and Install:**
```powershell
git clone https://github.com/JoeInnsp23/claude-glm-wrapper.git
cd claude-glm-wrapper
.\install.ps1
. $PROFILE
```

**Note:** If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

</details>

## Usage

### Available Commands & Aliases

The installer creates these commands and aliases:

| Alias | Full Command | What It Does | When to Use |
|-------|--------------|--------------|-------------|
| `cc` | `claude` | Regular Claude Code | Default - your normal Claude setup |
| `ccg` | `claude-glm` | GLM-4.6 (latest) | Best quality GLM model |
| `ccg45` | `claude-glm-4.5` | GLM-4.5 | Previous version of GLM |
| `ccf` | `claude-glm-fast` | GLM-4.5-Air (fast) | Quicker responses, lower cost |
| `ccx` | `ccx` | Multi-provider proxy | Switch between providers in-session |

**💡 Tip**: Use the short aliases! They're faster to type and easier to remember.

**🆕 New: ccx Multi-Provider Proxy**

The `ccx` command starts a local proxy that lets you switch between multiple AI providers in a single session:
- **OpenAI**: GPT-4o, GPT-4o-mini, and more
- **OpenRouter**: Access to hundreds of models
- **Google Gemini**: Gemini 1.5 Pro and Flash
- **Z.AI GLM**: GLM-4.6, GLM-4.5, GLM-4.5-Air
- **Anthropic**: Claude 3.5 Sonnet, etc.

Switch models mid-session using `/model <provider>:<model-name>`. Perfect for comparing responses or using the right model for each task!

### How It Works

Each command starts a **separate Claude Code session** with different configurations:
- `ccg`, `ccg45`, and `ccf` use Z.AI's API with your Z.AI key
- `cc` uses Anthropic's API with your Anthropic key (default Claude setup)
- Your configurations **never conflict** — they're stored in separate directories

### Basic Examples

**Start a coding session with the latest GLM:**
```bash
ccg
# Opens Claude Code using GLM-4.6
```

**Use GLM-4.5:**
```bash
ccg45
# Opens Claude Code using GLM-4.5
```

**Need faster responses? Use the fast model:**
```bash
ccf
# Opens Claude Code using GLM-4.5-Air
```

**Use regular Claude:**
```bash
cc
# Opens Claude Code with Anthropic models (your default setup)
```

**Pass arguments like normal:**
```bash
ccg --help
ccg "refactor this function"
ccf "quick question about Python"
```

## Common Workflows

### Workflow 1: Testing with GLM, Production with Claude
```bash
# Develop and test with cost-effective GLM-4.6
ccg
# ... work on your code ...
# exit

# Switch to Claude for final review
cc
# ... final review with Claude ...
```

### Workflow 2: Quick Questions with Fast Model
```bash
# Quick syntax questions
ccf "how do I use async/await in Python?"

# Complex refactoring with latest GLM
ccg
# ... longer coding session ...
```

### Workflow 3: Multiple Projects
```bash
# Project 1: Use GLM to save costs
cd ~/project1
ccg

# Project 2: Use Claude for critical work
cd ~/project2
cc
```

**Each session is independent** — your chat history stays separate!

## Using ccx (Multi-Provider Proxy)

### Setup

After installation, configure your API keys:

```bash
# First time setup
ccx --setup
```

This creates `~/.claude-proxy/.env`. Edit it to add your API keys:

```bash
# macOS / Linux
nano ~/.claude-proxy/.env

# Windows
notepad %USERPROFILE%\.claude-proxy\.env
```

Add keys for the providers you want to use:

```ini
# OpenAI
OPENAI_API_KEY=sk-...

# OpenRouter
OPENROUTER_API_KEY=sk-or-...

# Gemini
GEMINI_API_KEY=AIza...

# Z.AI GLM
GLM_UPSTREAM_URL=https://api.z.ai/api/anthropic
ZAI_API_KEY=...

# Anthropic (if you want to route through the proxy)
ANTHROPIC_UPSTREAM_URL=https://api.anthropic.com
ANTHROPIC_API_KEY=sk-ant-...
```

### Starting ccx

```bash
ccx
```

The proxy starts automatically and Claude Code connects to it.

### Switching Models

Use Claude Code's built-in `/model` command with provider prefixes:

```
/model openai:gpt-4o
/model openai:gpt-4o-mini
/model openrouter:anthropic/claude-3.5-sonnet
/model openrouter:meta-llama/llama-3.1-70b-instruct
/model gemini:gemini-1.5-pro
/model gemini:gemini-1.5-flash
/model glm:glm-4.6
/model glm:glm-4.5
/model anthropic:claude-3-5-sonnet-20241022
```

### ccx Workflows

**Workflow 1: Compare Model Responses**
```bash
ccx
# Ask a question
/model openai:gpt-4o
# Ask the same question
/model gemini:gemini-1.5-pro
# Ask again - compare the responses!
```

**Workflow 2: Cost Optimization**
```bash
ccx
# Start with a fast, cheap model for exploration
/model glm:glm-4.5-air
# ... work on the problem ...
# Switch to a more powerful model when needed
/model openai:gpt-4o
```

**Workflow 3: Leverage Model Strengths**
```bash
ccx
# Use GPT-4 for coding
/model openai:gpt-4o
# ... write code ...
# Use Claude for writing/docs
/model openrouter:anthropic/claude-3.5-sonnet
# ... write documentation ...
```

### ccx Advantages

✅ **Single Session**: No need to exit and restart
✅ **Context Preserved**: Chat history continues across model switches
✅ **Easy Comparison**: Switch models to compare responses
✅ **Flexibility**: Use the best model for each task
✅ **Provider Options**: OpenAI, OpenRouter, Gemini, GLM, Anthropic

### ccx vs Dedicated Wrappers

| Feature | ccx | ccg/ccg45/ccf |
|---------|-----|---------------|
| Switch models in-session | ✅ Yes | ❌ No |
| Multiple providers | ✅ Yes | ❌ GLM only |
| Separate chat history | ❌ No | ✅ Yes |
| Simple setup | ✅ .env file | ✅ Installer |
| Overhead | Proxy startup | None |

**Use ccx when**: You want flexibility and in-session switching
**Use dedicated wrappers when**: You want separate histories for different models

## Configuration Details

### Where Things Are Stored

Each wrapper uses its own configuration directory to prevent conflicts:

**macOS / Linux:**
| Command | Config Directory | Purpose |
|---------|-----------------|---------|
| `claude-glm` | `~/.claude-glm/` | GLM-4.6 settings and history |
| `claude-glm-4.5` | `~/.claude-glm-45/` | GLM-4.5 settings and history |
| `claude-glm-fast` | `~/.claude-glm-fast/` | GLM-4.5-Air settings and history |
| `claude` | `~/.claude/` (default) | Your original Claude setup |

**Windows:**
| Command | Config Directory | Purpose |
|---------|-----------------|---------|
| `claude-glm` | `%USERPROFILE%\.claude-glm\` | GLM-4.6 settings and history |
| `claude-glm-4.5` | `%USERPROFILE%\.claude-glm-45\` | GLM-4.5 settings and history |
| `claude-glm-fast` | `%USERPROFILE%\.claude-glm-fast\` | GLM-4.5-Air settings and history |
| `claude` | `%USERPROFILE%\.claude\` (default) | Your original Claude setup |

**This means:**
- ✅ Your original Claude settings are **never touched**
- ✅ Chat histories stay separate for each model
- ✅ API keys are isolated — no mixing!

### Wrapper Scripts Location

**macOS / Linux:** `~/.local/bin/`
- `claude-glm` (GLM-4.6)
- `claude-glm-4.5` (GLM-4.5)
- `claude-glm-fast` (GLM-4.5-Air)

**Windows:** `%USERPROFILE%\.local\bin\`
- `claude-glm.ps1` (GLM-4.6)
- `claude-glm-4.5.ps1` (GLM-4.5)
- `claude-glm-fast.ps1` (GLM-4.5-Air)

These are just tiny wrapper scripts (bash or PowerShell) that set the right environment variables before launching Claude Code.

## Updating Your API Key

### macOS / Linux

**Option 1: Use the Installer**
```bash
cd claude-glm-wrapper && bash install.sh
# Choose option "1) Update API key only"
```

**Option 2: Edit Manually**
```bash
nano ~/.local/bin/claude-glm
nano ~/.local/bin/claude-glm-4.5
nano ~/.local/bin/claude-glm-fast
# Find and replace ANTHROPIC_AUTH_TOKEN value
```

### Windows (PowerShell)

**Option 1: Use the Installer**
```powershell
cd claude-glm-wrapper
.\install.ps1
# Choose option "1) Update API key only"
```

**Option 2: Edit Manually**
```powershell
notepad "$env:USERPROFILE\.local\bin\claude-glm.ps1"
notepad "$env:USERPROFILE\.local\bin\claude-glm-4.5.ps1"
notepad "$env:USERPROFILE\.local\bin\claude-glm-fast.ps1"
# Find and replace $ZaiApiKey value
```

## How It Works (Technical Details)

The wrapper scripts work by setting environment variables before launching Claude Code:

| Environment Variable | What It Does |
|---------------------|--------------|
| `ANTHROPIC_BASE_URL` | Points to Z.AI's API endpoint |
| `ANTHROPIC_AUTH_TOKEN` | Your Z.AI API key |
| `ANTHROPIC_MODEL` | Which model to use (glm-4.5 or glm-4.5-air) |
| `CLAUDE_HOME` | Where to store config files |

Claude Code reads these variables and uses them instead of the defaults. Simple! 🎯

## Troubleshooting

### ❌ "claude command not found"

**Problem**: Claude Code isn't installed or not in your PATH.

**Solutions**:
1. Install Claude Code from [anthropic.com/claude-code](https://www.anthropic.com/claude-code)
2. Or add Claude to your PATH if it's installed elsewhere

**Test it**: Run `which claude` — it should show a path.

### ❌ "ccg: command not found" (or ccg45, ccf, cc)

**Problem**: You didn't source your shell config after installation.

**Solution**: Run the source command the installer showed you:
```bash
source ~/.zshrc  # or ~/.bashrc
```

**Still not working?** Try opening a new terminal window.

### ❌ API Authentication Errors

**Problem**: API key issues.

**Solutions for ccg/ccf/ccg45**:
1. **Check your key**: Visit [z.ai/manage-apikey/apikey-list](https://z.ai/manage-apikey/apikey-list)
2. **Verify credits**: Make sure your Z.AI account has available credits
3. **Update the key**: Run `bash install.sh` and choose "Update API key only"

**Solutions for ccx**:
1. **Check your .env file**: Edit `~/.claude-proxy/.env`
2. **Verify keys are set**: Make sure the API keys for the providers you're using are filled in
3. **No empty values**: If you're not using a provider, either leave it blank or remove the line
4. **Reload**: Restart ccx after editing .env

### ❌ ccx Proxy Won't Start

**Problem**: Proxy fails to start or times out.

**Solutions**:
1. **Check logs**: Look at `/tmp/claude-proxy.log` (Unix) or `%TEMP%\claude-proxy.log` (Windows)
2. **Port in use**: Another process might be using port 17870. Set `CLAUDE_PROXY_PORT=17871` in .env
3. **Missing dependencies**: Run `npm install -g tsx` to ensure TypeScript runner is available
4. **Check adapters**: Ensure `~/.claude-proxy/adapters/` directory exists and contains TS files

### ❌ Models Don't Switch in ccx

**Problem**: `/model` command doesn't seem to work.

**Solutions**:
1. **Check provider prefix**: Use format `/model provider:model-name` (e.g., `/model openai:gpt-4o`)
2. **Verify API key**: Make sure the provider's API key is set in `~/.claude-proxy/.env`
3. **Check proxy logs**: Look for errors in `/tmp/claude-proxy.log`

### ❌ Wrong Model Being Used

**Problem**: Using `ccg` but it's using the wrong API.

**Solution**: Each command is independent. Make sure you:
- Exit any running Claude Code session
- Start fresh with the command you want (`ccg`, `ccg45`, `ccf`, or `cc`)

### 🪟 Windows-Specific Issues

**❌ "cannot be loaded because running scripts is disabled"**

**Problem**: PowerShell execution policy prevents running scripts.

**Solution**:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**❌ "ccg: The term 'ccg' is not recognized"**

**Problem**: PowerShell profile wasn't reloaded after installation.

**Solutions**:
1. Reload profile: `. $PROFILE`
2. Or restart PowerShell
3. Or run the full command: `claude-glm`

**❌ PATH not updated**

**Problem**: The `~/.local/bin` or `$env:USERPROFILE\.local\bin` directory isn't in your PATH.

**Solution**: The installer adds it automatically, but you may need to restart PowerShell for it to take effect.

### 💡 General Tips

- **Open new terminal**: After installation, aliases work in new terminals automatically
- **Check the greeting**: Each command prints what model it's using when it starts
- **Test with**: `ccg --version` to verify the command works

## Uninstallation

### macOS / Linux

**Remove wrapper scripts:**
```bash
rm ~/.local/bin/claude-glm
rm ~/.local/bin/claude-glm-4.5
rm ~/.local/bin/claude-glm-fast
```

**Remove config directories** (optional - deletes chat history):
```bash
rm -rf ~/.claude-glm
rm -rf ~/.claude-glm-45
rm -rf ~/.claude-glm-fast
```

**Remove aliases** from `~/.zshrc` or `~/.bashrc`:
```bash
# Delete these lines:
# Claude Code Model Switcher Aliases
alias cc='claude'
alias ccg='claude-glm'
alias ccg45='claude-glm-4.5'
alias ccf='claude-glm-fast'
```

Then run: `source ~/.zshrc`

### Windows (PowerShell)

**Remove wrapper scripts:**
```powershell
Remove-Item "$env:USERPROFILE\.local\bin\claude-glm.ps1"
Remove-Item "$env:USERPROFILE\.local\bin\claude-glm-4.5.ps1"
Remove-Item "$env:USERPROFILE\.local\bin\claude-glm-fast.ps1"
```

**Remove config directories** (optional - deletes chat history):
```powershell
Remove-Item -Recurse "$env:USERPROFILE\.claude-glm"
Remove-Item -Recurse "$env:USERPROFILE\.claude-glm-45"
Remove-Item -Recurse "$env:USERPROFILE\.claude-glm-fast"
```

**Remove aliases** from PowerShell profile:
```powershell
notepad $PROFILE
# Delete these lines:
# Claude Code Model Switcher Aliases
Set-Alias cc claude
Set-Alias ccg claude-glm
Set-Alias ccg45 claude-glm-4.5
Set-Alias ccf claude-glm-fast
```

Then reload: `. $PROFILE`

## FAQ

### Q: Will this affect my existing Claude Code setup?
**A**: No! Your regular Claude Code setup is completely untouched. The wrappers use separate config directories.

### Q: Can I use both GLM and Claude in the same project?
**A**: Yes! Just use `ccg` for GLM sessions and `cc` for Claude sessions. Each maintains its own chat history. Or use `ccx` to switch between providers in a single session.

### Q: Which should I use: ccx or dedicated wrappers (ccg/ccf)?
**A**:
- **Use ccx** if you want to switch between multiple providers (OpenAI, Gemini, OpenRouter, GLM, Anthropic) in the same session
- **Use dedicated wrappers** if you want separate chat histories for different models/providers

### Q: Which model should I use?
**A**:
- Use **`ccx`** for: Maximum flexibility, model comparison, leveraging different model strengths
- Use **`ccg` (GLM-4.6)** for: Latest model, complex coding, refactoring, detailed explanations
- Use **`ccg45` (GLM-4.5)** for: Previous version, if you need consistency with older projects
- Use **`ccf` (GLM-4.5-Air)** for: Quick questions, simple tasks, faster responses
- Use **`cc` (Claude)** for: Your regular Anthropic Claude setup

### Q: How do I switch models in ccx?
**A**: Use the `/model` command with the format `<provider>:<model-name>`. For example:
- `/model openai:gpt-4o`
- `/model gemini:gemini-1.5-pro`
- `/model glm:glm-4.6`

### Q: Is this secure?
**A**: Yes! Your API keys are stored locally on your machine in wrapper scripts (bash or PowerShell, depending on your OS). Keep your scripts directory secure with appropriate permissions.

### Q: Does this work on Windows?
**A**: Yes! Use the PowerShell installer (install.ps1). Windows, macOS, and Linux are all fully supported.

### Q: Can I use a different Z.AI model?
**A**: Yes! Edit the wrapper scripts in `~/.local/bin/` and change the `ANTHROPIC_MODEL` variable to any model Z.AI supports.

### Q: What happens if I run out of Z.AI credits?
**A**: The GLM commands will fail with an API error. Just switch to regular Claude using `cc` until you add more credits.

## Contributing

Found a bug? Have an idea? Contributions are welcome!

- 🐛 **Report issues**: [GitHub Issues](https://github.com/JoeInnsp23/claude-glm-wrapper/issues)
- 🔧 **Submit PRs**: Fork, improve, and open a pull request
- 💡 **Share feedback**: Tell us how you're using this tool!

## License

MIT License - see [LICENSE](LICENSE) file for details.

**TL;DR**: Free to use, modify, and distribute. No warranty provided.

## Acknowledgments

- 🙏 [Z.AI](https://z.ai) for providing GLM model API access
- 🙏 [Anthropic](https://anthropic.com) for Claude Code
- 🙏 You, for using this tool!

---

**⭐ Found this useful?** Give it a star on GitHub and share it with others!
