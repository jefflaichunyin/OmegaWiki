# Configuration Templates

This directory contains configuration templates. Copy them to the correct locations during setup.

## Files

### `daily-arxiv.yml.example`

Daily arXiv recommendation preferences. Copy to `config/daily-arxiv.yml`:

```bash
cp config/daily-arxiv.yml.example config/daily-arxiv.yml
```

This file stores non-secret settings such as mode, categories, recommendation
caps, schedule, and profile hints. Keep API keys and SMTP credentials in `.env`
or GitHub Actions secrets.

### `.env.example`

Environment variables for API keys. Copy to project root:

```bash
cp config/.env.example .env
```

Then edit `.env` to add your API keys. See comments in the file for detailed instructions on each key.

### `settings.local.json.example`

Claude Code permission settings. Copy to `.claude/`:

```bash
mkdir -p .claude
cp config/settings.local.json.example .claude/settings.local.json
```

**For OpenCode users:** OpenCode has native compatibility with Claude Code file structures. Your `.claude/settings.local.json` will work, but you can also create an `opencode.json` in the project root for OpenCode-specific settings:

```bash
cp opencode.json.example opencode.json
```

See [OpenCode docs](https://opencode.ai/docs/permissions/) for the permissions format.

**What the permissions do:**

| Permission | Why it's needed |
|-----------|-----------------|
| `Bash(pip install:*)` | Install Python packages (e.g., during setup) |
| `Bash(python:*)` | Run Python tools (fetch_arxiv, fetch_s2, lint, etc.) |
| `Bash(python3:*)` | Same as above, for systems where `python3` is the command |
| `Bash(cp:*)` | Copy files (e.g., templates during /init) |
| `Bash(mkdir:*)` | Create directories (e.g., wiki subdirectories) |
| `Bash(git ls-tree:*)` | List files in git (used by some tools for discovery) |

These are the **minimum permissions** for ΩmegaWiki skills to function. Your AI agent will prompt you for approval when a skill tries to use a tool not in this list.

**To customize:**
- **Claude Code**: See [Claude Code docs](https://docs.anthropic.com/en/docs/claude-code) for the full permissions format.
- **OpenCode**: See [OpenCode permissions docs](https://opencode.ai/docs/permissions/) for configuration options.

### `server.yaml.example`

Remote GPU server configuration for `/exp-run --env remote`. Copy to `config/`:

```bash
cp config/server.yaml.example config/server.yaml
```

Then edit `config/server.yaml` with your server's SSH details, GPU info, conda environment, and work directory. See comments in the file for each field.

**Only needed if you run experiments on a remote server.** Local-only users can skip this.

**Key fields:**

| Field | Required | Example |
|-------|----------|---------|
| `host` | Yes | `gpu1.cs.university.edu` |
| `user` | Yes | `researcher` |
| `work_dir` | Yes | `/home/researcher/experiments` |
| `conda.path` + `conda.env` | One of conda or env_setup | `/opt/conda` + `research` |
| `port` | No (default 22) | `2222` |
| `identity_file` | No | `~/.ssh/id_ed25519` |
| `proxy_jump` | No | `bastion.cs.edu` |

## All Done by `setup.sh`

If you ran `setup.sh`, `.env` and `.claude/settings.local.json` are already
copied to the right locations. For OpenCode, `opencode.json.example` is also
available. `daily-arxiv.yml` and `server.yaml` are optional and can be created
later when you use those features.
