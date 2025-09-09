// for page navigation & to sort on leftbar

export type EachRoute = {
  title: string;
  href: string;
  noLink?: true; // noLink will create a route segment (section) but cannot be navigated
  items?: EachRoute[];
  tag?: string;
};

export const ROUTES: EachRoute[] = [
  {
    title: "Introduction",
    href: "/introduction",
    noLink: true,
    items: [
      { title: "What is LiSA", href: "/lisa" },
      { title: "What you can do", href: "/what-you-can-do" },
      { title: "$LISA at a glance", href: "/lisa-token-overview" },
    ],
  },
  {
    title: "Start here",
    href: "/start-here",
    noLink: true,
    items: [
      { title: "Requirements", href: "/requirements" },
      { title: "Connect", href: "/connect" },
      { title: "First actions", href: "/first-actions" },
      { title: "Transaction queue", href: "/transaction-queue" },
    ],
  },
  {
    title: "Moves",
    href: "/moves",
    noLink: true,
    items: [
      { title: "Introduction", href: "/introduction" },
      { title: "Transaction queue", href: "/transaction-queue" },
      { title: "Swap", href: "/swap" },
      { title: "Bridge", href: "/bridge" },
      { title: "Send", href: "/send" },
      { title: "Revoke", href: "/revoke" },
    ],
  },
  {
    title: "Strategies & Trading",
    href: "/strategies",
    noLink: true,
    items: [
      { title: "Overview", href: "/overview" },
      { title: "Authoring", href: "/authoring" },
      { title: "Run and monitor", href: "/run-and-monitor" },
      { title: "Where it runs and funding", href: "/where-it-runs-and-funding" },
      { title: "Strategies Hub", href: "/strategies-hub" },
      { title: "Backtesting", href: "/backtesting" },
    ],
  },
  {
    title: "Accounts and assets",
    href: "/accounts",
    noLink: true,
    items: [
      { title: "Wallets", href: "/wallets" },
      { title: "Linked addresses", href: "/linked-addresses" },
      { title: "Recipient policy", href: "/recipient-policy" },
      { title: "Balances and positions", href: "/balances-and-positions" },
      { title: "Approvals", href: "/approvals" },
      { title: "Coverage and refresh", href: "/coverage-and-refresh" },
    ],
  },
  {
    title: "Architecture",
    href: "/how-it-works",
    noLink: true,
    items: [
      { title: "Intent to transactions", href: "/intent-to-transactions" },
      { title: "Intent to strategy spec", href: "/intent-to-strategy-spec" },
      { title: "Trading engine", href: "/trading-engine" },
      { title: "Token and contracts", href: "/token-and-contracts" },
    ],
  },
  {
    title: "Chains and tokens",
    href: "/chains-and-tokens",
    noLink: true,
    items: [
      { title: "Networks", href: "/networks" },
      { title: "Tokens", href: "/tokens" },
    ],
  },

  {
    title: "$LISA Token (ERC-20)",
    href: "/lisa-token",
    noLink: true,
    items: [
      { title: "Summary", href: "/summary" },
      { title: "Access", href: "/access" },
      { title: "Locks", href: "/locks" },
      { title: "Fees and penalties", href: "/fees-and-penalties" },
      { title: "Splits", href: "/splits" },
      { title: "Status", href: "/status" },
    ],
  },
  { title: "Roadmap", href: "/roadmap" },
  {
    title: "Changelog",
    href: "/changelog",
    noLink: true,
    items: [
      { title: "LiSA Changelog", href: "/lisa" },
      { title: "Website changelog", href: "/website" },
    ],
  },
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();
