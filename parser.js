require('pointfree-fantasy').expose(global);

const fs = require('fs');

const _ = require('lodash');
const parse = require('bennu').parse;
const text = require('bennu').text;
const stream = require('nu-stream').stream;

const streamStr = compose(mconcat, stream.toArray);

const spaces = parse.many1(text.space);

const name = parse.either(
    text.string('spoiler'),
    text.string('item')
);

const value = parse.eager(parse.many1(
    text.noneOf('"')
));

const keyValue = k => text.string(k)
    .chain(__ => text.string('="'))
    .chain(__ => value)
    .chain(v => parse.next(
        text.character('"'),
        parse.of(_.fromPairs([[k, v]]))
    ));

const outerSpoiler = text.string('[spoiler]');

const endSpoiler = text.string('[/spoiler]');

const price = parse.eager(parse.many1(
    text.noneOf('"')
));

const priceSpoiler = text.string('[spoiler="')
    .chain(__ => price)
    .chain(p => parse.next(
        text.string('"]'),
        parse.of(p)
    ));

const item = text.string('[item')
    .chain(__ => spaces)
    .chain(__ => post.chain(__ => spaces)
        .chain(p => index.chain(__ => spaces)
        .chain(i => inline.chain(__ => spaces)
        .chain(inl => parse.of(_.assign({}, p, i, inl)))
    )))
    .chain(it => parse.next(
        parse.character(']'),
        it
    ));

const main = () => {
    const res = parse.run(bracket, '[ab/]');
    console.log(res);
};

main();
