# Atom Javascript Refactorings

Package providing Javascript refactorings capabilities for [Atom](https://atom.io/) editor, based on [Babel.js](https://babeljs.io/).
Supported languages:
 * Javascript.

## Demo:
![Extract function](https://raw.githubusercontent.com/mpi/atom-js-refactorings/master/demo/extract-function.gif "Extract function")

## Supported refactorings:
 * Rename identifier (`Shift + Alt + R`),
 * Extract function (`Shift + Alt + E`),
 * ~~Extract variable~~ (`Shift + Alt + V`) (S),
 * ~~Introduce parameter~~ (`Shift + Alt + P`) (M),
 * ~~Move function up~~ (`Shift + Alt + U`) (L),
 * ~~Inline function~~ (`Shift + Alt + I`) (M).

## To-Do:
 * Error message/warning should appear if refactoring is not possible (M)
 * Enter should "commit" refactoring (M),
 * ESC should "rollback" refactoing (M).

## See:
 * [Changelog](CHANGELOG.md)
