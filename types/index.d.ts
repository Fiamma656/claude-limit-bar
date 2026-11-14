export type Limit = { kind: string; percentUsed: number; resetsAt?: string }
export type Snap = { limits: Limit[]; usd?: number; tokens?: number; window?: number }

declare module 'claude-code' {
  interface PluginState {
    'limit-bar': { snap: Snap }
  }
}
