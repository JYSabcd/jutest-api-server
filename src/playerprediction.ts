import { Hono } from "hono";
import { headersOption, pool } from "./setting";
import pg from "pg";
const { Pool } = pg;

const api = new Hono()

api.get('/api/MainPlayer1', async c => {
    const reqUrl = new URL(c.req.url)
    const url = new URL("https://stats.nba.com/stats/commonplayerinfo?")
    url.searchParams.append('PlayerID', reqUrl.searchParams.get('PlayerID') ?? '')

    const res = await fetch(url, headersOption);
    const ResJson = await res.json();

    //console.log(ResJson);
    //console.log(ResJson.resultSets[0].headers);
    // console.log(ResJson.resultSets[0].rowSet);

    const rowSet = ResJson.resultSets[0].rowSet;
    const ReturnData: (number|string)[] = [];

    //  rowSet 에서 첫 배열 값만 사용한다. api 호출이 정상이라면 값은 한 개 다.
    ReturnData.push(rowSet[0][0]); //  PERSON_ID (PlayerID)
    ReturnData.push(rowSet[0][3]); //  DISPLAY_FIRST_LAST
    ReturnData.push(rowSet[0][7]); // BIRTHDATE
    ReturnData.push(rowSet[0][15]); // POSITION

    return c.json(ReturnData);
})

api.get('/api/MainPlayer2', async c => {
    const reqUrl = new URL(c.req.url)
    const url = new URL("https://stats.nba.com/stats/playerdashboardbygeneralsplits?LastNGames=0&LeagueID=00&MeasureType=Base&Month=0&OpponentTeamID=0&PaceAdjust=N&Period=0&PerMode=PerGame&PlusMinus=N&PORound=0&Rank=N&SeasonType=Regular+Season&Split=general")
    url.searchParams.append('Season', reqUrl.searchParams.get('Season') ?? '')
    url.searchParams.append('PlayerID', reqUrl.searchParams.get('PlayerID') ?? '')

    const res = await fetch(url, headersOption);
    const ResJson = await res.json();

    //console.log(ResJson);
    //console.log(ResJson.resultSets[0].headers);
    // console.log(ResJson.resultSets[0].rowSet);

    const rowSet:(number|string)[][] = ResJson.resultSets[0].rowSet;
    let ReturnData:(number|string)[] = [];

    //  rowSet 에서 첫 배열 값만 사용한다. api 호출이 정상이라면 값은 한 개 다.
    ReturnData.push(rowSet[0][2]); //  GP
    ReturnData.push(rowSet[0][6]); //  MIN
    ReturnData.push(rowSet[0][26]); // PTS
    ReturnData.push(rowSet[0][18]); // REB
    ReturnData.push(rowSet[0][19]); // AST

    return c.json(ReturnData);
})

api.get('/api/PlayerRoaster', async c => {
    const reqUrl = new URL(c.req.url)
    const url = new URL("https://stats.nba.com/stats/leaguedashplayerbiostats?PerMode=PerGame&SeasonType=Regular+Season")
    url.searchParams.append('Season', reqUrl.searchParams.get('Season') ?? '')
    url.searchParams.append('TeamID', reqUrl.searchParams.get('TeamID') ?? '')

    const res = await fetch(url, headersOption);
    const ResJson = await res.json();

    //console.log(ResJson);
    //console.log(ResJson.resultSets[0].headers);
    // console.log(ResJson.resultSets[0].rowSet);

    const rowSet:(number|string)[][] = ResJson.resultSets[0].rowSet;
    const ReturnData: (number|string)[][] = [];

    //  rowSet 에서 첫 배열 값만 사용한다. api 호출이 정상이라면 값은 한 개 다.
    for(let i = 0; i < rowSet.length; i++){
        let rowData:(number|string)[] = [];

        rowData.push(rowSet[i][1]); //  PLAYER_NAME
        rowData.push(rowSet[i][4]); // AGE
        rowData.push(rowSet[i][13]); // GP
        rowData.push(rowSet[i][14]); // PTS
        rowData.push(rowSet[i][15]); // REB
        rowData.push(rowSet[i][16]); // AST
        rowData.push(rowSet[i][0]); // PLAYERID

        ReturnData.push(rowData);
    }

    return c.json(ReturnData);
})

export default api