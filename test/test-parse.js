const should = require('chai').should();

const fs = require('fs');

const parse = require('bennu').parse;
const shopParser = require('../parser').shop;

const shop = [
    {"price":" ~b/o  3 chaos","items":[
        {"post":"11896626","index":"1","inline":"0"}
    ]},
    {"price":" ~b/o  4 chaos","items":[
        {"post":"11896626","index":"2","inline":"0"},
        {"post":"11896626","index":"3","inline":"0"}
    ]},
    {"price":" ~b/o  5 chaos","items":[
        {"post":"11896626","index":"4","inline":"0"}
    ]},
    {"price":" ~b/o  9 chaos","items":[
        {"post":"11896626","index":"5","inline":"0"}
    ]},
    {"price":" ~b/o  10 chaos","items":[
        {"post":"11896626","index":"6","inline":"0"},
        {"post":"11896626","index":"7","inline":"0"},
        {"post":"11896626","index":"8","inline":"0"}
    ]}
];

describe('Forum Parse', () =>
    describe('main', () =>
        it('should parse example correctly', done =>
            fs.readFile('test/res/forum.post', 'utf-8', (err, data) => {
                should.not.exist(err);
                should.exist(data);

                const res = parse.run(shopParser, data);
                res.should.deep.equal(shop);
                done();
            })
        )
    )
);
