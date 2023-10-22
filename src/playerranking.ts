import { Hono } from "hono";
import { headersOption, pool } from "./setting";
import pg from "pg";
const { Pool } = pg;

const api = new Hono()

const arrHeader = ['PLAYER_NAME','GP','MIN','PTS','REB','AST','STL','BLK','FG_PCT','FG3_PCT','FT_PCT','TEAM_ID','PLAYER_ID'];

api.get('/api', async c => {
    const reqUrl = new URL(c.req.url)
    const url = new URL("https://stats.nba.com/stats/leaguedashplayerstats?LastNGames=0&LeagueID=00&MeasureType=Base&Month=0&OpponentTeamID=0&PaceAdjust=N&Period=0&PerMode=PerGame&PlusMinus=N&PORound=0&Rank=N&TeamID=0&TwoWay=0")
    url.searchParams.append('Season', reqUrl.searchParams.get('Season') ?? '')     
    url.searchParams.append('SeasonType', reqUrl.searchParams.get('SeasonType') ?? '')     

    const res = await fetch(url, headersOption);
    const ResJson = await res.json();

    // console.log(ResJson);
    //console.log(ResJson.resultSets[0].headers);
    // console.log(ResJson.resultSets[0].rowSet);

    const arrHeaderIndex: number[] = [];
    const TableData: (number|string)[][] = [];

    let headers:(string[]) = [];
    headers = ResJson.resultSets[0].headers;

    for(let i = 0; i < arrHeader.length; i++){
        let index = headers.indexOf(arrHeader[i]);

        if(index === -1){
            console.error("헤더 이름을 찾지 못했다.", arrHeader[i]);
            index = 0;  //  배열 인덱스에 -1 이 들어가면 에러가 발생하므로 0으로 바꿔주자.. 하지만 잘못된 값을 참조할것이다.
        }

        arrHeaderIndex[i] = index;
    }

    //console.log(arrHeaderIndex);

    const rowSet:(number|string)[][] = ResJson.resultSets[0].rowSet;

    for(let i = 0; i < rowSet.length; i++){
        let rowData:(number|string)[] = [];

        for(let j = 0; j < arrHeaderIndex.length; j++){
            rowData.push(rowSet[i][arrHeaderIndex[j]]);
        }
        
        TableData.push(rowData);
    }

    //console.log(TableData);

    //return json({"TableData" : TableData});
    return c.json(TableData);
})

export default api