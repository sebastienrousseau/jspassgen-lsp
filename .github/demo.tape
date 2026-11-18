# SPDX-License-Identifier: Apache-2.0 OR MIT
#
# Rendered by `make demo` (vhs, https://github.com/charmbracelet/vhs) from
# the repository root after `npm ci`. On screen: examples/handshake.js
# starts the server on stdio and runs initialize, initialized, shutdown
# and exit, printing each message and the server's exit status. Nothing
# leaves the machine.
Output .github/demo.gif

Set Shell "bash"
Set FontSize 14
Set Width 1200
Set Height 280
Set Padding 20
Set Theme "Catppuccin Mocha"
Set WaitTimeout 30s
Set WaitPattern /^\$ ?$/

Hide
Type `export PS1='$ ' && clear`
Enter
Sleep 1s
Show

Type "node examples/handshake.js"
Sleep 500ms
Enter
Wait
Sleep 6s
