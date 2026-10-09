import { Octokit } from 'octokit';

export const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
});

export async function getWorkflows(owner: string, repo: string) {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: '.agent/workflows',
    });

    if (!Array.isArray(data)) return [];

    const workflows = await Promise.all(
      data
        .filter((file) => file.name.endsWith('.md') && !file.name.startsWith('_'))
        .map(async (file) => {
          const { data: contentData } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: file.path,
          });

          if ('content' in contentData) {
            const content = Buffer.from(contentData.content, 'base64').toString();
            const frontmatter = parseFrontmatter(content);
            return {
              name: file.name,
              path: file.path,
              ...frontmatter,
              repo,
            };
          }
          return null;
        })
    );

    return workflows.filter(Boolean);
  } catch (error) {
    console.error(`Error fetching workflows for ${repo}:`, error);
    return [];
  }
}

export async function dispatchWorkflow(
  _owner: string,
  _repo: string,
  _workflowCommand: string,
  _ref = 'main',
  _inputs: Record<string, unknown> = {}
) {
  // An arbitrary GitHub repository_dispatch cannot be authorized by caller
  // parameters. Keep the read-only GitHub client and deny mutation at its
  // library entrypoint until a separate typed broker exists (WarRoom #43).
  return { success: false, error: 'MUTATION_DISABLED' };
}

function parseFrontmatter(content: string) {
  const match = content.match(/^---([\s\S]*?)---/);
  if (!match) return { description: 'No description' };

  const fm = match[1];
  const result: Record<string, string> = {};
  for (const line of fm.split('\n')) {
    const [key, ...value] = line.split(':');
    if (key && value.length) {
      result[key.trim()] = value
        .join(':')
        .trim()
        .replace(/^["']|["']$/g, '');
    }
  }
  return result;
}
