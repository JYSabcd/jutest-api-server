import { Hono } from "hono";
import { headersOption, pool } from "./setting";
import pg from "pg";
import { url } from "inspector";
const { Pool } = pg;

const api = new Hono()
const arrHeader = ['TEAM_ID','PLAYER_ID','PLAYER_NAME','COMMENT','MIN','PTS','REB','AST','STL','BLK','FG_PCT','FG3_PCT'];

api.get('/api/boxscoretraditional', async c => {
    const reqUrl = new URL(c.req.url)
    const url = new URL("https://stats.nba.com/stats/boxscoretraditionalv2")
    url.searchParams.append("GameID", reqUrl.searchParams.get("GameID") ?? '')

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

    let rowSet:(number|string)[][] = ResJson.resultSets[0].rowSet;

    for(let i = 0; i < rowSet.length; i++){
        const rowData:(number|string)[] = [];

        for(let j = 0; j < arrHeaderIndex.length; j++){
            rowData.push(rowSet[i][arrHeaderIndex[j]]);
        }
        
        TableData.push(rowData);
    }

    return c.json(TableData);
})

api.get('/api/playbyplay', async c => {
    const reqUrl = new URL(c.req.url)
    const url = new URL("https://stats.nba.com/stats/playbyplayv3?EndPeriod=10&EndRange=55800&RangeType=2&StartPeriod=1&StartRange=0")
    url.searchParams.append("GameID", reqUrl.searchParams.get("GameID") ?? '')
    const res = await fetch(url, headersOption);
    const ResJson = await res.json();

    let TableData: {}[] = [];
    let actions: {}[] = ResJson.game.actions;

    let CurrentScore_Home =  0;
    let CurrentScore_Away =  0;

    for(let i = 0; i < actions.length; i++){
        if(actions[i]["actionType"] !== "Made Shot" 
        && actions[i]["actionType"] !== "Missed Shot"
        && actions[i]["actionType"] !== "Free Throw"
        && actions[i]["actionType"] !== "Jump Ball"
        ){
            continue;
        }

        if(actions[i]["actionType"] === "Free Throw"){
            actions[i]["xLegacy"] = 0;
            actions[i]["yLegacy"] = 167;    //  140이 원래 위치인데 .svelte 에서 보정값을 곱해주는 관계로 167
        } 
        
        if(actions[i]["pointsTotal"] === 0){
            //  미스샷일때도 scoreHome, scoreAway 값을 현재 스코어로 넣는다.
            actions[i]["scoreHome"] = CurrentScore_Home.toString();
            actions[i]["scoreAway"] = CurrentScore_Away.toString();
        } else{
            //  pointsTotal을 현재 득점한 값으로 바꾼다.
            if(actions[i]["location"] === "h"){
                actions[i]["pointsTotal"] = actions[i]["pointsTotal"] - CurrentScore_Home - CurrentScore_Away;
                CurrentScore_Home = CurrentScore_Home + actions[i]["pointsTotal"];
            }else{
                actions[i]["pointsTotal"] = actions[i]["pointsTotal"] - CurrentScore_Home - CurrentScore_Away;
                CurrentScore_Away = CurrentScore_Away + actions[i]["pointsTotal"];
            }
        }        
        
        TableData.push(actions[i]);
    }

    return c.json(TableData);
})

api.get('/db/GetScheduleByTeam', async c => {
    const url = new URL(c.req.url)

    const connectToDB = await pool.connect();

    const teamid = url.searchParams.get("TeamID");

    let query = "select * from public.game_schedule "
    +"where to_char(game_date, 'yyyy-mm') = '" + `${url.searchParams.get("ScheduleYYYYMM")}` + "' " 
    +"and (home_teamid = " + teamid + " or away_teamid = " + teamid + ") "
    +"order by game_date;";

    const res = await connectToDB.query(query);

    connectToDB.release();
    
    return c.json(res.rows);
})

export default api