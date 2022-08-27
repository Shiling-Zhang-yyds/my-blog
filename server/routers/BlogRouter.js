const express = require('express')
const router = express.Router()
const { db, genid } = require('../database/DbUtils')

router.get("/detail", async (req, res) => {

    let { id } = req.query
    let detail_sql = "SELECT * FROM `blog` WHERE `id` = ? "
    let { err, rows } = await db.async.all(detail_sql, [id]);

    if (err == null) {
        console.log('blog/detail success');
        res.send({
            code: 200,
            msg: "获取成功",
            rows
        })
    } else {
        console.log('blog/detail fail');
        res.send({
            code: 500,
            msg: "获取失败"
        })
    }

})

//列表接口
router.get('/list', async (req, res) => {
    const search_sql = 'SELECT * FROM `blog`';
    let { err, rows } = await db.async.all(search_sql, []);
    if (err == null) {
        console.log('blog/list success');
        res.send({
            code: 200,
            msg: '查询成功',
            rows
        })
    }
    else {
        console.log('blog/list fail');
        res.send({
            code: 500,
            msg: '查询失败'
        })
    }
})

//添加博客
router.post('/_token/add', async (req, res) => {
    let { title, categoryId, content } = req.body;
    let id = genid.NextId();
    let create_time = new Date().getTime();

    const insert_sql = 'INSERT INTO `blog`(`id`,`title`,`category_id`,`content`,`create_time`) VALUES (?,?,?,?,?)';
    let params = [id, title, categoryId, content, create_time];

    let { err, rows } = await db.async.run(insert_sql, params);
    if (err == null) {
        console.log('blog/add success');
        res.send({
            code: 200,
            msg: '添加成功',
            rows
        })
    }
    else {
        console.log('blog/add fail');
        res.send({
            code: 500,
            msg: '添加失败'
        })
    }
})

//修改博客
router.put('/_token/update', async (req, res) => {
    let { id, title, categoryId, content } = req.body;
    // let create_time = new Date().getTime();

    const update_sql = 'UPDATE `blog` SET `title` = ?,`content` = ?,`category_id` = ? WHERE `id` = ?';
    let params = [title, content, categoryId, id];

    let { err, rows } = await db.async.run(update_sql, params);
    if (err == null) {
        console.log('blog/update success');
        res.send({
            code: 200,
            msg: '修改成功',
            rows
        })
    }
    else {
        console.log('blog/update fail');
        res.send({
            code: 500,
            msg: '修改失败'
        })
    }
})
//删除博客
router.delete('/_token/delete', async (req, res) => {
    let id = req.body.id;
    console.log(id);
    const delete_sql = 'DELETE FROM `blog` WHERE `id` = ?';
    let { err, rows } = await db.async.run(delete_sql, [id]);
    if (err == null) {
        console.log('blog/delete success');
        res.send({
            code: 200,
            msg: '删除成功'
        })
    }
    else {
        console.log('blog/delete fail');
        res.send({
            code: 500,
            msg: '删除失败'
        })
    }
})

//查询博客
router.get('/search', async (req, res) => {
    let { keyword, categoryId, page, pageSize } = req.query;
    page = page == null ? 1 : page;
    pageSize = pageSize == null ? 10 : pageSize;
    categoryId = categoryId == null ? 0 : categoryId;
    keyword = keyword == null ? '' : keyword;

    let params = [];
    let whereSqls = [];
    if (categoryId != 0) {
        whereSqls.push('`category_id` = ?');
        params.push(categoryId);
    }
    if (keyword != '') {
        whereSqls.push('(`title` LIKE ? OR `content` LIKE ?)');
        params.push('%' + keyword + '%');
        params.push('%' + keyword + '%');
    }
    let whereSqlStr = '';
    if (whereSqls.length > 0) {
        whereSqlStr = ' WHERE ' + whereSqls.join(' AND ');
    }
    // 查询分页数据
    let searchSql = " SELECT `id`,`category_id`,`create_time`,`title`,substr(`content`,0,50) AS `content` FROM `blog` " + whereSqlStr + " ORDER BY `create_time` DESC LIMIT ?,? "
    // 1 10  2,10    3,5
    // 1 10 2,10
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize]); // 分页

    // 查询数据总数
    let searchCountSql = ' SELECT count(*) AS `count` FROM `blog` ' + whereSqlStr;
    let searchCountParams = params;

    let searchResult = await db.async.all(searchSql, searchSqlParams);
    let countResult = await db.async.all(searchCountSql, searchCountParams);

    console.log(searchSql, countResult)
    if (searchResult.err == null && countResult.err == null) {
        console.log('blog/search success');
        res.send({
            code: 200,
            msg: '查询成功',
            data: {
                keyword,
                categoryId,
                page,
                pageSize,
                rows: searchResult.rows,
                count: countResult.rows[0].count
            }
        })
    }
    else {
        console.log('blog/search fail');
        res.send({
            code: 500,
            msg: '查询失败'
        })
    }
})



module.exports = router