var test = require('tap').test;
var expansions = require('..');

test('A string with no expansions returns the string unmodified', function(t) {
    t.plan(1);
    t.equal(expansions.expandString('a'), 'a');
});

test('A simple pre-phase expansion', function(t) {
    t.plan(7);
    t.equal(expansions.expandString('<(a)', { a: '1' }, 'pre'), '1');
    t.equal(expansions.expandString('<(a)23', { a: '1' }, 'pre'), '123');
    t.equal(expansions.expandString('0<(a)2', { a: '1' }, 'pre'), '012');
    t.equal(expansions.expandString('<(a))', { a: '1' }, 'pre'), '1)');
    t.equal(expansions.expandString('(<(a)', { a: '1' }, 'pre'), '(1');
    t.equal(expansions.expandString('<<(a)', { a: '1' }, 'pre'), '<1');
    t.equal(expansions.expandString('>(a)', { a: '1' }, 'pre'), '>(a)');
});

test('A simple post-phase expansion', function(t) {
    t.plan(7);
    t.equal(expansions.expandString('>(a)', { a: '1' }, 'post'), '1');
    t.equal(expansions.expandString('>(a)23', { a: '1' }, 'post'), '123');
    t.equal(expansions.expandString('0>(a)2', { a: '1' }, 'post'), '012');
    t.equal(expansions.expandString('>(a))', { a: '1' }, 'post'), '1)');
    t.equal(expansions.expandString('(>(a)', { a: '1' }, 'post'), '(1');
    t.equal(expansions.expandString('>>(a)', { a: '1' }, 'post'), '>1');
    t.equal(expansions.expandString('<(a)', { a: '1' }, 'post'), '<(a)');
});
