import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../../../src/primitives/searchable-select.tsx", import.meta.url),
  "utf8",
);

test("searchable select exposes an accessible keyboard-operated listbox", () => {
  assert.match(source, /@base-ui\/react\/combobox/);
  assert.match(source, /Combobox\.Input/);
  assert.match(source, /Combobox\.List/);
  assert.match(source, /Combobox\.Item/);
  assert.match(source, /autoHighlight/);
});
