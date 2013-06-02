var test = require('tap').test;
var expansions = require('..');

test('A string with no expansions returns the string unmodified', function(t) {
    t.plan(1);
    t.equal(expansions.expandString('a'), 'a');
});

test('A simple pre-phase expansion', function(t) {
    t.plan(1);
    t.equal(expansions.expandString('<(a)', { a: '1' }, 'pre'), '1');
});
