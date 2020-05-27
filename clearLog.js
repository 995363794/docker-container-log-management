var fs = require('fs');
// var path = require('path');
// var basePath = path.join(__dirname, 'resources');
//遍历文件夹，获取所有文件夹里面的文件信息


// const FileMax = 1024 * 1 //mb
// const loopTime = 1000 * 10 //10min
const FileMax = 1024 * 500 //mb
const loopTime = 1000 * 60 * 10 //10min

function geFileList(folderPath, fileName) {
    this.folderPath = folderPath; //文件夹路径
    this.fileName = fileName;
    this.filesList = [];
    //遍历读取文件
    this.readFile = function (path) {
        var filesList = this.filesList;

        var files = fs.readdirSync(path);//需要用到同步读取
        files.forEach(function (file) {
            var states = fs.statSync(path + '/' + file);
            if (states.isDirectory()) {
                this.readFile(path + '/' + file, filesList);

            }
            else if (!(/cp/.test(file))) {
                //创建一个对象保存信息
                var obj = new Object();
                obj.size = states.size;//文件大小，以字节为单位
                obj.name = file;//文件名
                obj.path = path + '/' + file; //文件绝对路径
                obj.path_old = path + '/cp' + file;
                obj.path_pwd = path + '/cp';
                this.filesList.push(obj);
                // console.log(this.filesList)
            } else {
                console.log('other' + file)
            }
        }.bind(this));
    }

    //写入文件utf-8格式
    this.writeFile = function (data) {
        fs.writeFile(this.fileName, data, 'utf-8', function () {
            console.log("文件生成成功");
        });
    }
    this.formatHandler = function () {
        var filesList = this.filesList;
        var strJSON = {
            "jsFile": {},
            "cssFile": {}
        };
        for (var i = 0; i < filesList.length; i++) {
            var item = filesList[i],
                thisName = item.name,
                nameNoSuffix;

            if (/\.log$/.test(thisName)) {
                //判断是否为log文件
                nameNoSuffix = thisName.split('.')[0];
                console.log(thisName + `:` + (item.size / 1024).toFixed(2) + "/kb")
                if (item.size / 1024 > FileMax) {
                    //然后进行转存w
                    cp(item.path, item.path_old, (PATH) => {
                        // fs.unlinkSync(PATH)
                        fs.writeFile(PATH, null, function (err) {
                            if (err) throw new Error('writeFile wrong was happended');
                        })
                    })
                    //删除文件
                }
            }
        }
        function cp(path, pathOld, rmFunciton) {
            let path_n = path
            let pathOld_n = pathOld
            // console.log(path_n)
            fs.readFile(path_n, function (err, data) {
                if (err) throw new Error('readFile wrong was happended');
                console.log('==cp' + pathOld_n)
                fs.writeFile(pathOld_n, data, function (err) {
                    if (err) throw new Error('writeFile wrong was happended');
                    rmFunciton(path_n)
                })
            })
        }
    }
    this.init = function () {
        var that = this;
        console.log('test01');
        //判断打包的时候文件路径是否存在
        fs.exists(this.folderPath, function (exists) {
            if (exists) {
                that.readFile(that.folderPath);
                that.formatHandler();
            }
        });
    }
}

//生成json map
// ask json
var askFileList = new geFileList("/var/lib/docker/containers");

askFileList.filesList = [];
askFileList.init();
setInterval(() => {
    askFileList.filesList = [];
    askFileList.init();
}, loopTime);

module.exports = geFileList;