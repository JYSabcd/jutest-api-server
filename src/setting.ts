import pg from "pg";
const { Pool } = pg;
export const headersOption:RequestInit = {
    headers:{
        'Host': 'stats.nba.com',
        'Referer': 'https://www.nba.com',
        'Origin': 'https://stats.nba.com/',
        'x-nba-stats-origin': 'stats',
        'x-nba-stats-token': 'true',
        'Cache-Control': 'max-age=0',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
    }
};


// const config = {
//     host: process.env.DBconfig_host ?? '',
//     user: process.env.DBconfig_user ?? '',
//     password: process.env.DBconfig_password ?? '',
//     database: process.env.DBconfig_database ?? '',
//     port: isNaN(Number(process.env.DBconfig_port)) ? 5432 : Number(process.env.DBconfig_port),
//     ssl: false
// };

const config = {
    host: 'nba-project.kro.kr',
    user: 'jys0521',
    password: 'abcdxyz',
    database: 'nbadb',
    port: 5432,
    ssl: false
};

// console.log(process.env.DBconfig_host);

export const pool = new Pool(config);