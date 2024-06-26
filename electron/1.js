var fn1 = {
    rotl: function (t, e) {
        return t << e | t >>> 32 - e
    },
    rotr: function (t, e) {
        return t << 32 - e | t >>> e
    },
    endian: function (t) {
        if (t.constructor == Number)
            return 16711935 & fn1.rotl(t, 8) | 4278255360 & fn1.rotl(t, 24);
        for (var e = 0; e < t.length; e++)
            t[e] = fn1.endian(t[e]);
        return t
    },
    bytesToWords: function (t) {
        for (var e = [], r = 0, n = 0; r < t.length; r++,
            n += 8)
            e[n >>> 5] |= t[r] << 24 - n % 32;
        return e
    },
}


var n = {
    stringToBytes: function (t) {
        return n.bin.stringToBytes(unescape(encodeURIComponent(t)))
    },
    bytesToString: function (t) {
        return decodeURIComponent(escape(n.bin.bytesToString(t)))
    },

    bin: {
        stringToBytes: function (t) {
            for (var e = [], r = 0; r < t.length; r++)
                e.push(255 & t.charCodeAt(r));
            return e
        },
        bytesToString: function (t) {
            for (var e = [], r = 0; r < t.length; r++)
                e.push(String.fromCharCode(t[r]));
            return e.join("")
        }
    }
}


s = function (t, r) {
    t.constructor == String ? t = r && "binary" === r.encoding ? i.stringToBytes(t) : n.stringToBytes(t) : o(t) ? t = Array.prototype.slice.call(t, 0) : Array.isArray(t) || t.constructor === Uint8Array || (t = t.toString());
    for (var a = fn1.bytesToWords(t), u = 8 * t.length, c = 1732584193, f = -271733879, h = -1732584194, l = 271733878, p = 0; p < a.length; p++)
        a[p] = 16711935 & (a[p] << 8 | a[p] >>> 24) | 4278255360 & (a[p] << 24 | a[p] >>> 8);
    a[u >>> 5] |= 128 << u % 32,
        a[14 + (u + 64 >>> 9 << 4)] = u;
    var d = s._ff
        , y = s._gg
        , v = s._hh
        , b = s._ii;
    for (p = 0; p < a.length; p += 16) {
        var g = c
            , m = f
            , _ = h
            , w = l;
        c = d(c, f, h, l, a[p + 0], 7, -680876936),
            l = d(l, c, f, h, a[p + 1], 12, -389564586),
            h = d(h, l, c, f, a[p + 2], 17, 606105819),
            f = d(f, h, l, c, a[p + 3], 22, -1044525330),
            c = d(c, f, h, l, a[p + 4], 7, -176418897),
            l = d(l, c, f, h, a[p + 5], 12, 1200080426),
            h = d(h, l, c, f, a[p + 6], 17, -1473231341),
            f = d(f, h, l, c, a[p + 7], 22, -45705983),
            c = d(c, f, h, l, a[p + 8], 7, 1770035416),
            l = d(l, c, f, h, a[p + 9], 12, -1958414417),
            h = d(h, l, c, f, a[p + 10], 17, -42063),
            f = d(f, h, l, c, a[p + 11], 22, -1990404162),
            c = d(c, f, h, l, a[p + 12], 7, 1804603682),
            l = d(l, c, f, h, a[p + 13], 12, -40341101),
            h = d(h, l, c, f, a[p + 14], 17, -1502002290),
            c = y(c, f = d(f, h, l, c, a[p + 15], 22, 1236535329), h, l, a[p + 1], 5, -165796510),
            l = y(l, c, f, h, a[p + 6], 9, -1069501632),
            h = y(h, l, c, f, a[p + 11], 14, 643717713),
            f = y(f, h, l, c, a[p + 0], 20, -373897302),
            c = y(c, f, h, l, a[p + 5], 5, -701558691),
            l = y(l, c, f, h, a[p + 10], 9, 38016083),
            h = y(h, l, c, f, a[p + 15], 14, -660478335),
            f = y(f, h, l, c, a[p + 4], 20, -405537848),
            c = y(c, f, h, l, a[p + 9], 5, 568446438),
            l = y(l, c, f, h, a[p + 14], 9, -1019803690),
            h = y(h, l, c, f, a[p + 3], 14, -187363961),
            f = y(f, h, l, c, a[p + 8], 20, 1163531501),
            c = y(c, f, h, l, a[p + 13], 5, -1444681467),
            l = y(l, c, f, h, a[p + 2], 9, -51403784),
            h = y(h, l, c, f, a[p + 7], 14, 1735328473),
            c = v(c, f = y(f, h, l, c, a[p + 12], 20, -1926607734), h, l, a[p + 5], 4, -378558),
            l = v(l, c, f, h, a[p + 8], 11, -2022574463),
            h = v(h, l, c, f, a[p + 11], 16, 1839030562),
            f = v(f, h, l, c, a[p + 14], 23, -35309556),
            c = v(c, f, h, l, a[p + 1], 4, -1530992060),
            l = v(l, c, f, h, a[p + 4], 11, 1272893353),
            h = v(h, l, c, f, a[p + 7], 16, -155497632),
            f = v(f, h, l, c, a[p + 10], 23, -1094730640),
            c = v(c, f, h, l, a[p + 13], 4, 681279174),
            l = v(l, c, f, h, a[p + 0], 11, -358537222),
            h = v(h, l, c, f, a[p + 3], 16, -722521979),
            f = v(f, h, l, c, a[p + 6], 23, 76029189),
            c = v(c, f, h, l, a[p + 9], 4, -640364487),
            l = v(l, c, f, h, a[p + 12], 11, -421815835),
            h = v(h, l, c, f, a[p + 15], 16, 530742520),
            c = b(c, f = v(f, h, l, c, a[p + 2], 23, -995338651), h, l, a[p + 0], 6, -198630844),
            l = b(l, c, f, h, a[p + 7], 10, 1126891415),
            h = b(h, l, c, f, a[p + 14], 15, -1416354905),
            f = b(f, h, l, c, a[p + 5], 21, -57434055),
            c = b(c, f, h, l, a[p + 12], 6, 1700485571),
            l = b(l, c, f, h, a[p + 3], 10, -1894986606),
            h = b(h, l, c, f, a[p + 10], 15, -1051523),
            f = b(f, h, l, c, a[p + 1], 21, -2054922799),
            c = b(c, f, h, l, a[p + 8], 6, 1873313359),
            l = b(l, c, f, h, a[p + 15], 10, -30611744),
            h = b(h, l, c, f, a[p + 6], 15, -1560198380),
            f = b(f, h, l, c, a[p + 13], 21, 1309151649),
            c = b(c, f, h, l, a[p + 4], 6, -145523070),
            l = b(l, c, f, h, a[p + 11], 10, -1120210379),
            h = b(h, l, c, f, a[p + 2], 15, 718787259),
            f = b(f, h, l, c, a[p + 9], 21, -343485551),
            c = c + g >>> 0,
            f = f + m >>> 0,
            h = h + _ >>> 0,
            l = l + w >>> 0
    }
    return fn1.endian([c, f, h, l])
};
s._ff = function (t, e, r, n, o, i, s) {
    var a = t + (e & r | ~e & n) + (o >>> 0) + s;
    return (a << i | a >>> 32 - i) + e
}
    ,
    s._gg = function (t, e, r, n, o, i, s) {
        var a = t + (e & n | r & ~n) + (o >>> 0) + s;
        return (a << i | a >>> 32 - i) + e
    }
    ,
    s._hh = function (t, e, r, n, o, i, s) {
        var a = t + (e ^ r ^ n) + (o >>> 0) + s;
        return (a << i | a >>> 32 - i) + e
    }
    ,
    s._ii = function (t, e, r, n, o, i, s) {
        var a = t + (r ^ (e | ~n)) + (o >>> 0) + s;
        return (a << i | a >>> 32 - i) + e
    }
    ,
    s._blocksize = 16,
    s._digestsize = 16,




















    function s2(t) {
        return i()("".concat(t ? Object.keys(t).sort().reduce((function (e, r) {
            var n = t[r];
            if (void 0 === n)
                return e;
            if (Number.isNaN(n) && (n = ""),
                Array.isArray(n)) {
                if (0 === n.length)
                    return "".concat(e).concat(r);
                var o = n.sort().map((function (t) {
                    return t instanceof Object ? JSON.stringify(t) : t
                }
                )).reduce((function () {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ""
                        , e = arguments.length > 1 ? arguments[1] : void 0;
                    return t + (t ? "," : "") + e
                }
                ));
                return "".concat(e).concat(r).concat(o)
            }
            return n instanceof Object ? e + r + JSON.stringify(n) : e + r + n.toString()
        }
        ), "") : "", "048a9c4943398714b356a696503d2d36"))
    }



function bytesToHex(t) {
    for (var e = [], r = 0; r < t.length; r++)
        e.push((t[r] >>> 4).toString(16)),
            e.push((15 & t[r]).toString(16));
    return e.join("")
}

function wordsToBytes(t) {
    for (var e = [], r = 0; r < 32 * t.length; r += 8)
        e.push(t[r >>> 5] >>> 24 - r % 32 & 255);
    return e
}



function generateParams(t) {
    return ("".concat(t ? Object.keys(t).sort().reduce((function (e, r) {
        var n = t[r];
        if (void 0 === n)
            return e;
        if (Number.isNaN(n) && (n = ""),
            Array.isArray(n)) {
            if (0 === n.length)
                return "".concat(e).concat(r);
            var o = n.sort().map((function (t) {
                return t instanceof Object ? JSON.stringify(t) : t
            }
            )).reduce((function () {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ""
                    , e = arguments.length > 1 ? arguments[1] : void 0;
                return t + (t ? "," : "") + e
            }
            ));
            return "".concat(e).concat(r).concat(o)
        }
        return n instanceof Object ? e + r + JSON.stringify(n) : e + r + n.toString()
    }
    ), "") : "", "048a9c4943398714b356a696503d2d36"))
}


const testData = { "spuId": 1003735, "propertyValueId": 0, "sourceName": "h5", "skuId": 602234780, "abTests": [{ "name": "newsr", "value": "2" }, { "name": "5.16_certificate", "value": "1" }], "extDatas": [{ "name": "CUSTOM_RECOMMEND_SWITCH", "value": "0" }] }


// const a = s(generateParams(testData))

// const sign = bytesToHex(wordsToBytes(a))

function getSign(p) {

    const a = s(generateParams(p))

    const sign = bytesToHex(wordsToBytes(a))
    return sign
}

module.exports = {
    getSign
}

// testData.sign = sign


// fetch("https://app.dewu.com/api/v1/h5/pc/index/fire/flow/product/detailV3", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "zh,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7",
//     "appid": "h5",
//     "appversion": "5.31.0",
//     "content-type": "application/json",
//     "platform": "h5",
//     "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-site",
//     "cookie": "dw_edge_er_cookie=7df2ac4c-ecbf-1c4b-2147-c8b7402dc2ef; sajssdk_2015_cross_new_user=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221904d5281e21589-0c8d971254b384-26001f51-2073600-1904d5281e32415%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTkwNGQ1MjgxZTIxNTg5LTBjOGQ5NzEyNTRiMzg0LTI2MDAxZjUxLTIwNzM2MDAtMTkwNGQ1MjgxZTMyNDE1In0%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%22%2C%22value%22%3A%22%22%7D%2C%22%24device_id%22%3A%221904d5281e21589-0c8d971254b384-26001f51-2073600-1904d5281e32415%22%7D; duToken=30c5e4e392f7d65584bd2bf437cfae3a521bfa7020b9eef03a444c5bc728598368eff609b1f1fd53a368ccb596296d49|134333474|1719284189|4408e67ae57c9ece162575f46a9a970fe15a3b70|2-0",
//     "Referer": "https://www.dewu.com/",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": JSON.stringify(testData),
//     "method": "POST"
// }).then(res => res.json())
// .then(RES => console.log(RES))

// console.log(bytesToHex(wordsToBytes(a)),);