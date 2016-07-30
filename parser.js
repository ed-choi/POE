require('pointfree-fantasy').expose(global);

const fs = require('fs');

const _ = require('lodash');
const parse = require('bennu').parse;
const text = require('bennu').text;

// this syntax makes me sad
const eagerConcat = compose(map(mconcat), parse.eager);
const eagerMany = compose(parse.eager, parse.many);
const eagerMany1 = compose(parse.eager, parse.many1);

// consume p and resolve with (pure) x if it is successful
const ensure = p => x => parse.next(p, parse.of(x));

const spaces = parse.many1(text.space);

const optSpaces = parse.many(text.space);

const sepBy = (p, q) => parse.many(q)
    .chain(__ => p)
    .chain(ensure(parse.many(q)))

const spaceSep = p => eagerMany1(sepBy(p, text.space));

const stringValue = eagerConcat(parse.many1(
    text.noneOf('"')
));

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

const items = spaceSep(item);

const outerSpoiler = text.string('[spoiler]');

const endSpoiler = text.string('[/spoiler]');

// [spoiler=" ~b/o 9 chaos"]
const priceSpoiler = text.string('[spoiler="')
    .chain(__ => stringValue)
    .chain(ensure(text.string('"]')));

const priceBlock = priceSpoiler
    .chain(pr => items
        .chain(its => endSpoiler
        .chain(__ => parse.of({'price': pr, 'items': its})
    )));

const priceBlocks = spaceSep(priceBlock);

const shop = outerSpoiler
    .chain(__ => priceBlocks)
    .chain(ensure(endSpoiler));

const main = () => {
    fs.readFile('forum.post', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        const res = parse.run(shop, data);
        console.log(JSON.stringify(res));
    });
};

exports.shop = shop;
