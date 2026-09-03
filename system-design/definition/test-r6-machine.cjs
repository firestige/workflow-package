const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const read = name => JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));

test('SD-09 selects a non-empty affected subset while every selected branch remains required', () => {
  const workflow = read('workflow.json');
  const parallel = workflow.graph.nodes.find(node => node.id === 'node.sd-09');
  assert.deepEqual(parallel.selection, {
    source: { kind: 'state', field: 'selected_review_lenses' }
  });
  assert.ok(parallel.branches.every(branch => branch.required === true));
  const selection = workflow.state.fields.find(field => field.name === 'selected_review_lenses');
  assert.equal(selection.type, 'array');
  assert.equal(selection.items.type, 'string');
  assert.deepEqual(selection.items.enum, parallel.branches.map(branch => branch.id));
});

test('SD-02 grilling remains Action-scoped and does not route through a Workflow Wait', () => {
  const workflow = read('workflow.json');
  const grilling = workflow.graph.nodes.find(node => node.id === 'node.sd-02');
  assert.deepEqual(grilling.routing.cases.map(entry => entry.value).sort(), ['continue', 'unmatched']);
  assert.equal(workflow.graph.nodes.some(node => node.id.includes('user-grilling-answer')), false);
  assert.equal((workflow.waits || []).some(wait => wait.id.includes('user-grilling-answer')), false);

  const action = read('actions.json').actions.find(candidate => candidate.id === 'action.sd-02');
  assert.deepEqual(action.interaction, {
    mode: 'action-scoped',
    completion: 'structured-only'
  });
  assert.ok(action.resultSchema.required.includes('workingBrief'),
    'the structured completion must contain the value projected into SD-03');
});
