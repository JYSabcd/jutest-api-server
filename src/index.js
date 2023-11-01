const http = require('https')
const zlib = require('zlib')


const req = http.request('https://stats.nba.com/stats/commonteamroster?LeagueID=00&Season=2022-23&TeamID=1610612737',{
    method:'GET',
    headers:{
        'Referer': 'https://www.nba.com',
        'Accept-Encoding': 'gzip, deflate, br',
    }
}, res => {
    const arr = []
    res.on('data', d => {
        arr.push(d)
    })
    res.on('end', () => {
        const buf = Buffer.concat(arr)
        const buf2 = zlib.gunzipSync(buf)
        console.log(buf2.toString('utf-8'))
    })
})

req.end(null)