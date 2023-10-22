import { Hono } from "hono";
import { headersOption, pool } from "./setting";
import pg from "pg";
const { Pool } = pg;

const api = new Hono()

const arrHeader = ['PLAYER_ID','PLAYER_NAME','TEAM_ID','TEAM_ABBREVIATION',
    'PTS','PTS_RANK',
    'REB','REB_RANK',
    'AST', 'AST_RANK',
    'BLK', 'BLK_RANK',
    'STL', 'STL_RANK',
    'NBA_FANTASY_PTS', 'NBA_FANTASY_PTS_RANK',
];

api.get('/api/leaguedashplayerstats', async c => {
    const reqUrl = new URL(c.req.url)
    const now = new Date()
    let FromDate = reqUrl.searchParams.get('DateFrom') ?? `${now.getFullYear()}-${now.getMonth().toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`;    //  'YYYY-MM-DD'
    let nYear = parseInt(FromDate?.slice(0,4)); //  YYYY
    let nMonth = parseInt(FromDate?.slice(5,7)); //  MM

    let strSeason = ""; //  "2022-23"
    if(nMonth <= 6){
        strSeason = `${nYear-1}-${nYear%100}`;
    }else{
        strSeason = `${nYear}-${(nYear+1)%100}`;
    }

    const url = new URL("https://stats.nba.com/stats/leaguedashplayerstats?LastNGames=0&LeagueID=00&MeasureType=Base&Month=0&OpponentTeamID=0&Period=0&PerMode=PerGame&PlusMinus=N")
    url.searchParams.append('Season', strSeason)
    url.searchParams.append('DateFrom', reqUrl.searchParams.get('DateFrom') ?? '')
    url.searchParams.append('DateTo', reqUrl.searchParams.get('DateTo') ?? '')

    const res = await fetch(url, headersOption);
    const ResJson = await res.json();


    let arrHeaderIndex: number[] = [];
    let TableData: (number|string)[][] = [];

    let headers:string[] = [];
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

    let rowSet:(number|string)[][] = ResJson.resultSets[0].rowSet;

    for(let i = 0; i < rowSet.length; i++){
        let rowData:(number|string)[] = [];

        for(let j = 0; j < arrHeaderIndex.length; j++){
            rowData.push(rowSet[i][arrHeaderIndex[j]]);
        }
        
        TableData.push(rowData);
    }
    return c.json(TableData);
})

api.get('/db/getschedule', async c => {
    const url = new URL(c.req.url)
    const connectToDB = await pool.connect();

    let query = `select * from public.game_schedule where game_date = '${url.searchParams.get("SelectedDate")}';`;

    const res = await connectToDB.query(query);

    connectToDB.release();
    
    return c.json(res.rows);
})

export default api