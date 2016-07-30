require('pointfree-fantasy').expose(global);

const _ = require('lodash');
const parse = require('bennu').parse;
const text = require('bennu').text;

// this syntax makes me sad
const eagerConcat = compose(map(mconcat), parse.eager);

// consume p and resolve with (pure) x if it is successful
const ensure = p => x => parse.next(p, parse.of(x));

const spaces = parse.many1(text.space);

const stringValue = eagerConcat(parse.many1(
    text.noneOf('"')
));

const outerSpoiler = text.string('[spoiler]');

const endSpoiler = text.string('[/spoiler]');

// [spoiler=" ~b/o 9 chaos"]
const priceSpoiler = text.string('[spoiler="')
    .chain(__ => stringValue)
    .chain(ensure(text.string('"]')));

// key="value"
const keyValue = k => text.string(k)
    .chain(__ => text.string('="'))
    .chain(__ => stringValue)
    .chain(v => parse.next(
        text.character('"'),
        parse.of(_.fromPairs([[k, v]]))
    ));

const post = keyValue('post');
const index = keyValue('index');
const inline = keyValue('inline');

// [item post="1234" index="5" inline="432"]
const item = text.string('[item')
    .chain(__ => spaces)
    .chain(__ => post)
    .chain(p => spaces.chain(__ => index)
        .chain(i => spaces.chain(__ => inline)
        .chain(inl => parse.of(_.assign({}, p, i, inl))
    )))
    .chain(ensure(text.character(']')));

const main = () => {
    const res = parse.run(item, '[item post="1234" index="5" inline="432"]');
    console.log(res);
};

main();
