# limit-bar – Quick-View-Limit für Claude

Ein Claude-Mod, der dauerhaft eine Statuszeile über dem Prompt anzeigt:

```
5h ████░░░░░░ 42% · Reset in 2:10 h   Woche ██░░░░░░░░ 18% · Reset in 3d 5h   Kosten $3.40   Kontext 76k / 200k
```

- **5h / Woche:** verbrauchter Anteil des jeweiligen Limit-Fensters (ab 90 % mit Warnzeichen ⚠, ohne Farben, damit es überall lesbar bleibt)
- **Reset in:** Zeit bis zum Reset, getrennt für das 5h-Fenster und die Woche
- **Kosten:** Sitzungskosten in Dollar
- **Kontext:** belegte Tokens / Kontextfenster des Modells

Die Werte stammen direkt von Claude Code und aktualisieren sich nach jedem Turn.
Limit-Angaben gibt es nur mit Abo (Pro/Max); ohne Abo bleiben diese Felder leer.

## Installation

Im Prompt einer Claude-Code-Sitzung:

```
/plugin install limit-bar --marketplace Fiamma656/claude-limit-bar
```

Oder in der Shell:

```
claude plugin install limit-bar --marketplace Fiamma656/claude-limit-bar
```

Danach `/reload-plugins` ausführen (oder die Sitzung neu starten).

## Lizenz

MIT, siehe `LICENSE`.
