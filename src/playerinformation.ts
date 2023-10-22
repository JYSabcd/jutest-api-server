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

    const rowSet:(number|string)[][] = ResJson.resultSets[0].rowSet;
    let ReturnData: (number|string)[] = [];

    //  rowSet 에서 첫 배열 값만 사용한다. api 호출이 정상이라면 값은 한 개 다.
    ReturnData.push(rowSet[0][0]); //  PERSON_ID (PlayerID)
    ReturnData.push(rowSet[0][3]); //  DISPLAY_FIRST_LAST
    ReturnData.push(rowSet[0][11]); // HEIGHT
    ReturnData.push(rowSet[0][12]); // WEIGHT
    ReturnData.push(rowSet[0][7]); // BIRTHDATE
    ReturnData.push(rowSet[0][9]); // COUNTRY
    ReturnData.push(rowSet[0][14]); // JERSEY 등번호
    ReturnData.push(rowSet[0][15]); // POSITION
    ReturnData.push(rowSet[0][13]); // SEASON_EXP

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
    const ReturnData: (number|string)[] = [];

    //  rowSet 에서 첫 배열 값만 사용한다. api 호출이 정상이라면 값은 한 개 다.
    ReturnData.push(rowSet[0][6]); //  MIN
    ReturnData.push(rowSet[0][26]); // PTS
    ReturnData.push(rowSet[0][18]); // REB
    ReturnData.push(rowSet[0][19]); // AST
    ReturnData.push(rowSet[0][28]); // NBA-Fantasy-Point

    return c.json(ReturnData);
})

api.get('/api/PlayerRoaster', async c => {
    const reqUrl = new URL(c.req.url)
    const url = new URL("https://stats.nba.com/stats/commonteamroster?LeagueID=00")
    url.searchParams.append('Season', reqUrl.searchParams.get('Season') ?? '')
    url.searchParams.append('TeamID', reqUrl.searchParams.get('TeamID') ?? '')
    console.log(url)
    const res = await fetch(url , headersOption);
    console.log('완료');
    const ResJson = await res.json();

    //console.log(ResJson);
    //console.log(ResJson.resultSets[0].headers);
    // console.log(ResJson.resultSets[0].rowSet);

    const rowSet:(number|string)[][] = ResJson.resultSets[0].rowSet;
    const ReturnData: (number|string)[][] = [];

    //  rowSet 에서 첫 배열 값만 사용한다. api 호출이 정상이라면 값은 한 개 다.
    for(let i = 0; i < rowSet.length; i++){
        const rowData:(number|string)[] = [];

        rowData.push(rowSet[i][3]); //  PLAYER (PLAYER NAME)
        rowData.push(rowSet[i][6]); // NUM (등번호)
        rowData.push(rowSet[i][7]); // POSITION
        rowData.push(rowSet[i][11]); // AGE
        rowData.push(rowSet[i][8]); // HEIGHT
        rowData.push(rowSet[i][9]); // WEIGHT
        rowData.push(rowSet[i][14]); // PLAYERID

        ReturnData.push(rowData);
    }

    return c.json(ReturnData);
})

export default api