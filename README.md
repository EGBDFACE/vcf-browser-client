## VCF Browser

### 技术栈

- react（主要框架）
- redux（状态管理）
- react-router（路由）
- typescript（语法规范）
- webpack（打包工具）
- axios（请求）
- sass（样式）
- koa2（后台框架）
- MongoDB（数据库）

> [后台仓库](https://github.com/JackChuChou/vcf-browser-server)

### 主要功能

- 用户注册登录
- 文件上传
- 原始文件表格分页展示及查询过滤
- 变异注释文件分片及汇总可视化图形展示和查询过滤

### 运行界面

#### 首页

![首页](./public/img/homePage.png)

#### 注册 

![注册](./public/img/signUp.png)

#### 登录

![登录](./public/img/signIn.png)

#### 登录成功及请求文件

![登录成功](./public/img/signInSuccess.png)

![请求已上传文件](./public/img/userGetFile.png)

#### 文件上传

![文件上传](./public/img/fileUpload.png)

#### 表格展示及过滤

![表格](./public/img/table.png)

#### 变异数据分片及汇总展示、过滤

![分片展示](./public/img/chunkChart.png)

![汇总展示](./public/img/totalChunksChart.png)

![汇总过滤](./public/img/totalChunkFilter.png)

### 模块分析

#### 用户注册登录

主要技术难点

- 隐私信息加密传输
- token登录令牌的问题

隐私信息简单的说就是用户的密码，这里采用的是**加盐**、**HMAC+时间**的方式解决。加盐就是在传输用户密码时候之前首先向服务器请求随机盐，然后将盐与密码混合做[HMAC](https://baike.baidu.com/item/hmac)，这里散列函数的选择为密钥扩展的慢哈希函数[bcrypt](http://blog.jobbole.com/61872/),然后将得到的“密码”与当前的时间（精确到分钟）做一次SHA(<https://stark-summer.iteye.com/blog/1313884>)加密得到最终上传的“密码”，服务端也进行同样的步骤，将注册时保存的“密码”（加了盐之后）与当前时间或者±1分钟来进行SHA，然后将得到的“标准密码”与上传密码做匹配判断。

token令牌的问题在这里采用的就是比较简单的方式，因为文件分析这个模块并不是和用户关联性非常大，必要性不是很强，所以就是在文件上传的请求部分添加当前用户名字段，如果未登录该字段为空。💥 后期还需要改善💥 ，预计使用[JWT](<http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html>)替换。

#### 文件上传分析及高性能可视化展示

实现高性能：

- 分片梯度上传（断点续传、秒传）
- 分片处理结果展示

分片对原始文件对象进行梯度切分（文件大小随着分片序号的增加而增加）读取，对于切分的文件进行冗余信息删除、包装、上传、注释、返回结果，每个分片的处理都是并行执行，分片处理结果返回前端之后即可进行当前分片的可视化图表展示，所有分片处理完成之后可以进行整个文件的汇总数据可视化展示，分片的做法可以实现大文件的变异在线分析，因为每次读取都只是一个相对较小的分片文件。
