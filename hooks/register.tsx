import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Snap } from '../types'

const snap = atom({ plugin: 'limit-bar', key: 'snap' } as const, { limits: [] } as Snap)

const bar = (pct: number) => {
  const n = Math.max(0, Math.min(10, Math.round(pct / 10)))
  return '█'.repeat(n) + '░'.repeat(10 - n)
}

const clock = (iso: string | undefined, now: number) => {
  if (!iso) return '–'
  const m = Math.max(0, Math.round((Date.parse(iso) - now) / 60000))
  const d = Math.floor(m / 1440)
  const h = Math.floor((m % 1440) / 60)
  const mm = String(m % 60).padStart(2, '0')
  return d > 0 ? `${d}d ${h}h` : `${h}:${mm} h`
}

const k = (n: number) => `${Math.round(n / 1000)}k`
const color = (pct: number) => (pct >= 90 ? 'red' : pct >= 70 ? 'yellow' : 'green')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const u = await $.session.usage()
    await update($, snap, () => ({
      limits: u.rateLimits,
      usd: u.cost?.usd,
      tokens: u.context.tokens,
      window: u.context.window,
    }))
    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    await update($, snap, () => ({
      limits: e.rateLimits,
      usd: e.cost?.usd,
      tokens: e.context.tokens,
      window: e.context.window,
    }))
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const s = await read($, snap)
    if (e.props.hasSurvey) return next(e)

    const now = await $.clock.now()
    const { Box, Text } = $.ui.resolve(e)
    const five = s.limits.find(l => l.kind === 'five_hour')
    const week = s.limits.find(l => l.kind === 'seven_day')
    const next_ = [five, week].filter(Boolean).sort((a, b) =>
      Date.parse(a!.resetsAt ?? '9e15') - Date.parse(b!.resetsAt ?? '9e15'))[0]

    const parts: any[] = []
    const lim = (label: string, l: typeof five) =>
      l && (
        <Text key={label}>
          {label}{' '}
          <Text color={color(l.percentUsed)}>{bar(l.percentUsed)} {Math.round(l.percentUsed)}%</Text>
          {'   '}
        </Text>
      )
    parts.push(lim('5h', five), lim('Woche', week))
    if (next_) parts.push(<Text key="reset">Reset in <Text bold>{clock(next_.resetsAt, now)}</Text>{'   '}</Text>)
    if (s.usd !== undefined) parts.push(<Text key="cost">Kosten ${s.usd.toFixed(2)}{'   '}</Text>)
    if (s.tokens !== undefined && s.window)
      parts.push(<Text key="ctx">Kontext {k(s.tokens)} <Text dimColor>/ {k(s.window)}</Text></Text>)

    if (parts.filter(Boolean).length === 0) return next(e)
    return <Box>{parts}</Box>
  })
}
