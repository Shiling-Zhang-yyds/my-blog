const express = require('express')
const router = express.Router()
const fs = require('fs')
const { db, genid } = require('../database/DbUtils')
router.post('/rich_editor_upload', async (req, res) => {
    if (!req.files) {
        // console.log('/rich_editor_upload `not a file`')
        res.send({
            'errno': 1, //只要不等于 0 就行
            'message': '上传为空'
        })
        return;
    }
    console.log('/rich_editor_upload `visiting`')

    let files = req.files;
    let ret_files = [];
    for (let file of files) {
        //获取文件名字后缀
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
        //随机生成文件名
        let file_name = genid.NextId() + '.' + file_ext;

        //修改名称+移动文件位置
        fs.renameSync(
            process.cwd() + '/public/upload/temp/' + file.filename, 
            process.cwd() + '/public/upload/' + file_name
            )
        ret_files.push('/upload/' + file_name)
    }
    res.send({
        'errno': 0, //注意，值是数字，不能是字符串
        'data': {
            'url': ret_files[0] //图片 src, 必须
        }
    })
})

module.exports = router