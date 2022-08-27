const express = require('express')
const multer = require('multer')
const path = require('path')
const { db, genid } = require('./database/DbUtils')

const app = express();

const port = 5500
// 处理跨域请求
app.use((req, res, next) => {
    //设置允许跨域的域名
    res.header('Access-Control-Allow-Origin', '*');
    //允许的header类型
    res.header('Access-Control-Allow-Headers', '*');
    //跨域允许的请求方式
    res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
    if (req.method == 'OPTIONS') res.sendStatus(200); // 让options请求快点结束
    else next();
})
//中间件
app.use(express.json())
const upload = multer({
    dest: './public/upload/temp'
})
app.use(upload.any()) //处理上传
app.use(express.static(path.join(__dirname, 'public')))// 添加静态资源目录


//categories/_token/add
const ADMIN_TOKEN_PATH = '/_token'
app.all('*', async (req, res, next) => {
    if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
        let { token } = req.headers;
        let admin_token_sql = 'SELECT * FROM `admin` WHERE  `token` = ?';
        let adminResult = await db.async.all(admin_token_sql, [token]);
        if (adminResult.rows.length == 0 || adminResult.err != null) {
            res.send({
                code: 403,
                msg: '请先登录'
            })
            return;
        }
        else {
            next()
        }
    }
    else {
        next()
    }
})



// 注册路由
app.use('/test', require('./routers/TestRouter'))
app.use('/admin', require('./routers/AdminRouter'))
app.use('/category', require('./routers/Categories'))
app.use('/blog', require('./routers/BlogRouter'))
app.use('/upload', require('./routers/UploadRouter'))

app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(port, () => {
    console.log(`server running at  http://localhost:${port}`);
})