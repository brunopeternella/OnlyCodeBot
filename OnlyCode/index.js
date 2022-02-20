require('dotenv').config()
const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const got = require('got')
const languages = require('./languages.json').languages.split(',').toString()

const consumerKeys = {
    key: process.env.CONSUMER_KEY,
    secret: process.env.CONSUMER_SECRET
}

const token = {
    key: process.env.ACCESS_TOKEN,
    secret: process.env.ACCESS_TOKEN_SECRET,
}

const oauth = OAuth({
    consumer: consumerKeys,
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
    }
})

async function query(language) {
    try {
        const _url = `${process.env.QUERY_ENDPOINT}query=${language}&max_results=11`;

        const authHeader = oauth.toHeader(oauth.authorize({
            url: _url,
            method: 'GET'
        }, token));

        return await got.get(_url, {
            headers: {
                Authorization: authHeader["Authorization"]
            }
        })
    } catch (err) {
        console.error(`Query falhou! Erro: ${err.message}`);
        console.error(err.stack);
    }
}

async function like(tweetId) {
    try {
        const data = {
            "tweet_id": `${tweetId}`
        };

        const _url = `https://api.twitter.com/2/users/${process.env.USER_ID}/likes`;

        const authHeader = oauth.toHeader(oauth.authorize({
            url: _url,
            method: 'POST'
        }, token))

        return await got.post(_url, {
            json: data,
            responseType: 'json',
            headers: {
                Authorization: authHeader["Authorization"],
                'content-type': "application/json",
                'accept': "application/json"
            }
        })
    } catch (err) {
        console.error(`Like falhou! Erro: ${err.message}`)
    }
}

async function retweet(tweetId) {
    try {
        const data = {
            "tweet_id": `${tweetId}`
        };

        const _url = `https://api.twitter.com/2/users/${process.env.USER_ID}/retweets`;

        const authHeader = oauth.toHeader(oauth.authorize({
            url: _url,
            method: 'POST'
        }, token));

        return await got.post(_url, {
            json: data,
            responseType: 'json',
            headers: {
                Authorization: authHeader["Authorization"],
                'content-type': "application/json",
                'accept': "application/json"
            }
        })
    } catch (err) {
        console.error(`Retweet falhou! Erro: ${err.message}`)
    }
}

async function Start() {
    var tweets = []
    var tweetsCount = 0
    var totalTweets
    var body
    var isLiked

    //como definir palavras? KKKKKKKKKKKKKKKKKK
    //10 like e rt em cada palavra?
    //é massa, n precisa usar o next_token
    
    /*await query("JavaScript").then(res => {
        body = JSON.parse(res.body)
    });

    body.data.forEach(tweet => {
        tweetsCount++
        tweets.push(tweet)
    });

    totalTweets = tweetsCount

    for (const tweet of tweets) {
        await like(tweet.id).then(res => {
            isLiked = res.body.data.liked
            console.log(`Tweet id: ${tweet.id} recebeu like? ${isLiked}!`)
        })

        await retweet(tweet.id).then(res => {
            console.log(`Tweet id: ${tweet.id} retweeted!`)
        })
        console.log()
    }

    console.log(`Likes e Rt realizados! TweetsCount = ${totalTweets}`);*/

    //console.log(languages);
}

//fazer ele rodar com timeset?
Start();