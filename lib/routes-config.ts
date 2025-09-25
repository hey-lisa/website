// for page navigation & to sort on leftbar

export type EachRoute = {
  title: string;
  href: string;
  noLink?: true; // noLink will create a route segment (section) but cannot be navigated
  items?: EachRoute[];
};

export const ROUTES: EachRoute[] = [
  {
    title: "introduction",
    href: "/introduction",
    noLink: true,
    items: [
      { title: "lisa", href: "/lisa" },
      { title: "what_you_can_do", href: "/what-you-can-do" },
      { title: "lisa_token_overview", href: "/lisa-token-overview" },
      { title: "security", href: "/security" },
    ],
  },
  {
    title: "start_here",
    href: "/start-here",
    noLink: true,
    items: [
      { title: "requirements", href: "/requirements" },
      { title: "connect", href: "/connect" },
      { title: "first_actions", href: "/first-actions" },
      { title: "transaction_queue", href: "/transaction-queue" },
    ],
  },
  {
    title: "moves",
    href: "/moves",
    noLink: true,
    items: [
      { title: "moves_introduction", href: "/introduction" },
      { title: "moves_transaction_queue", href: "/transaction-queue" },
      { title: "swap", href: "/swap" },
      { title: "bridge", href: "/bridge" },
      { title: "send", href: "/send" },
      { title: "revoke", href: "/revoke" },
    ],
  },
  {
    title: "strategies",
    href: "/strategies",
    noLink: true,
    items: [
      { title: "strategies_overview", href: "/overview" },
      { title: "authoring", href: "/authoring" },
      { title: "run_and_monitor", href: "/run-and-monitor" },
      { title: "where_it_runs_and_funding", href: "/where-it-runs-and-funding" },
      { title: "strategies_hub", href: "/strategies-hub" },
      { title: "backtesting", href: "/backtesting" },
    ],
  },
  {
    title: "accounts",
    href: "/accounts",
    noLink: true,
    items: [
      { title: "accounts", href: "/accounts" },
      { title: "linked_addresses", href: "/linked-addresses" },
      { title: "recipient_policy", href: "/recipient-policy" },
      { title: "balances_and_positions", href: "/balances-and-positions" },
      { title: "approvals", href: "/approvals" },
    ],
  },
  {
    title: "how_it_works",
    href: "/how-it-works",
    noLink: true,
    items: [
      { title: "intent_to_transactions", href: "/intent-to-transactions" },
      { title: "intent_to_strategy_spec", href: "/intent-to-strategy-spec" },
      { title: "trading_engine", href: "/trading-engine" },
      { title: "token_and_contracts", href: "/token-and-contracts" },
    ],
  },
  {
    title: "chains_and_tokens",
    href: "/chains-and-tokens",
    noLink: true,
    items: [
      { title: "networks", href: "/networks" },
      { title: "tokens", href: "/tokens" },
    ],
  },
  {
    title: "lisa_token",
    href: "/lisa-token",
    noLink: true,
    items: [
      { title: "summary", href: "/summary" },
      { title: "access", href: "/access" },
      { title: "locks", href: "/locks" },
      { title: "fees_and_penalties", href: "/fees-and-penalties" },
      { title: "splits", href: "/splits" },
      { title: "status", href: "/status" },
    ],
  },
  {
    title: "project_updates",
    href: "/project-updates",
    noLink: true,
    items: [
      { title: "roadmap", href: "/roadmap" },
      { title: "lisa_changelog", href: "/changelog/lisa" },
      { title: "website_changelog", href: "/changelog/website" },
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
