import { Hono } from 'hono'
import { headersOption } from './setting'

const api = new Hono()

api.get('/api/playerrosters', async c => {
    const reqUrl = new URL(c.req.url)
    const url = new URL('https://stats.nba.com/stats/leaguedashplayerbiostats?PerMode=PerGame&SeasonType=Regular+Season')
    url.searchParams.append('Season', reqUrl.searchParams.get('Season') ?? '')
    url.searchParams.append('TeamID', reqUrl.searchParams.get('TeamID') ?? '')

    const res = await fetch(url, headersOption);
    const ResJson = await res.json();

    //console.log(ResJson);
    //console.log(ResJson.resultSets[0].headers);
    // console.log(ResJson.resultSets[0].rowSet);

    const rowSet:(number|string)[][] = ResJson.resultSets[0].rowSet;

    const ReturnData: (number|string)[][] = [];

    for(let i = 0; i < rowSet.length; i++){
        let rowData:(number|string)[] = [];

        rowData.push(rowSet[i][1]); //  PLAYER_NAME
        rowData.push(rowSet[i][0]); //  PLAYER_ID
        
        ReturnData.push(rowData);
    }

    return c.json(ReturnData);
})

api.get('/api/playerstats', async c => {
    const reqUrl = new URL(c.req.url)
    const url = new URL("https://stats.nba.com/stats/playerdashboardbygeneralsplits?LastNGames=0&LeagueID=00&MeasureType=Base&Month=0&OpponentTeamID=0&PaceAdjust=N&Period=0&PerMode=PerGame&PlusMinus=N&PORound=0&Rank=N&Split=general&SeasonType=Regular+Season")
    url.searchParams.append('Season', reqUrl.searchParams.get('Season') ?? '')
    url.searchParams.append('PlayerID', reqUrl.searchParams.get('PlayerID') ?? '')

    const res = await fetch(url, headersOption);
    const ResJson = await res.json();

    //console.log(ResJson);
    //console.log(ResJson.resultSets[0].headers);
    // console.log(ResJson.resultSets[0].rowSet);

    const rowSet:(number|string)[][] = ResJson.resultSets[0].rowSet;
    const ReturnData: (number|string)[] = [];

    //  rowSet 에서 첫 배열 값만 사용한다. api 호출이 정상이라면 값은 한 개 다.
    // MIN, PTS, REB, AST, STL, BLK
    for(const i of [6, 26, 18, 19, 21, 22]){
        ReturnData.push(rowSet[0][i])
    }

    return c.json(ReturnData);
})

api.get('/api/playerstatsaverage', async c => {
    const reqUrl = new URL(c.req.url)
    const url = new URL("https://stats.nba.com/stats/leaguedashplayerstats?LastNGames=0&LeagueID=00&MeasureType=Base&Month=0&OpponentTeamID=0&PaceAdjust=N&Period=0&PerMode=PerGame&PlusMinus=N&PORound=0&Rank=N&SeasonType=Regular+Season&TeamID=0&TwoWay=0")
    url.searchParams.append('Season', reqUrl.searchParams.get('Season') ?? '')
    const res = await fetch(url, headersOption);
    const ResJson = await res.json();
    const rowSet:(number|string)[][] = ResJson.resultSets[0].rowSet;

    let PlayerCount = 0;
    const ReturnData:number[] = [0, 0, 0, 0, 0, 0];
    for(let i = 0; i < rowSet.length; i++){
        if(Number(rowSet[i][6]) < 58){ // 58경기 미만인 선수들 버림
            continue;
        }

        ReturnData[0] += Number(rowSet[i][10]); // MIN
        ReturnData[1] += Number(rowSet[i][30]); // PTS
        ReturnData[2] += Number(rowSet[i][22]); // REB
        ReturnData[3] += Number(rowSet[i][23]); // AST
        ReturnData[4] += Number(rowSet[i][25]); // STL
        ReturnData[5] += Number(rowSet[i][26]); // BLK
        PlayerCount += 1; // 선수가 들어올 때 한명씩 더함
    }

    if(PlayerCount === 0){
        return c.json(ReturnData.map(v => (v).toFixed(1)));
    } else{
        return c.json(ReturnData.map(v => (v/PlayerCount).toFixed(1)));
    }
})

export default api