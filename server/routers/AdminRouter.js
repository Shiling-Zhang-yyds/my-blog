const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid') //node uuid
const { db, genid } = require('../database/DbUtils')
router.post('/login', async (req, res) => {
    let { account, password } = req.body;// 获取传入的post中的账户和密码的信息
    // 通过数据库查找相应的账户和密码对应的信息，随后返回错误信息或者结果
    let { err, rows } = await db.async.all('select * from `admin` where `account` = ? AND `password` = ?', [account, password])
    // 如果没有错误并且结果非空
    if (err == null && rows.length > 0) {
        let login_token = uuidv4();// 随机生成一个'token'值来验证用户登陆状态。每次登录都会随机生成一个token
        let update_token_sql = 'UPDATE `admin` SET `token` = ? where `id` = ?'// 将新生成的token更新进数据库

        await db.async.run(update_token_sql, [login_token, rows[0].id]);

        let admin_info = rows[0];
        admin_info.token = login_token;
        admin_info.password = '';// 将返回的数据的密码置空，因为防止密码被泄露
        console.log('/login  success');
        res.send({
            code: 200,
            msg: '登陆成功',
            data: admin_info
        })
    }
    else {
        console.log('/login  success');
        res.send({
            code: 500,
            msg: '登陆失败'
        })
    }
})

module.exports = router