// Concept bodies store real, portable relative `.md` links (per OKF spec) so the
// bundle stays inspectable outside the app. For rendering in the browser, rewrite
// same-source relative links into clickable in-app routes.
const RELATIVE_MD_LINK_RE = /\]\(\.\/([^)]+)\.md\)/g;

export function rewriteConceptLinks(body: string, sourceSlug: string): string {
  return body.replace(RELATIVE_MD_LINK_RE, (_match, slug: string) => `](/knowledge-viewer/${sourceSlug}/${slug})`);
}
