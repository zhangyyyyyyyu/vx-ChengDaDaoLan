************************Tree hole*******************************

######授权登录(loginTest界面)

---点击按钮授权登录
    ①将用户的  昵称(nickName) 和 头像(avatUrl) 传递到云数据库treeHoleUserInfo(独立集合  里边只有userName 和 userIcon)
     

    ②页面会跳转到square页面


######广场界面(square页面)

---页面会自动加载出云数据库中储存的数据
    ①调用getData函数获取云数据库(treeHoleContent和treeHoleTalk集合中的数据)  并直接用onLoad获取数据库(treeHoleUserInfo数据)
        treeHoleContent中数据赋给list数组      treeHoleTalk中数据赋给talkMain       treeHoleUserInfo获取其userName赋给talkUser知道是谁再发此条评论

---点击点赞图像实现点赞功能
    ①通过获取数据的id(treeHoleContent中的数据以)交给zan函数来处理此用户是否已经点过赞  来限制其点赞数  
        s1:用户点击点赞图标时会向函数传值(利用data-set)  函数利用传入的值获取到集合下的数据中对应的此id--------实现 获取到集合下对应的对象(也就是用户所选择对象)Id
             var item_id = e.currentTarget.dataset.id;
        
        s2:获取到之前点过赞的id(此id利用wx.getStorageSync(函数名)保存)  
              var cookie_id=wx.getStorageSync('zan')||[];//获取全部点赞的id  本函数的函数名即 zan 

        s3:遍历集合中(从treeHoleContent获取到所有信息的集合)所有id，与item_id匹配看是否相等(无不相等的  因为不想等数据库中没有自然也不会for出来)----------实现 用户点击的id与集合中筛选到对应id的匹配
             for (var i = 0; i < that.data.list.length;i++)                              if (this.data.list[i]._id==item_id)

        s4:之后判断此对象是否已经点过赞   点过赞便取消此次点赞的Id(即用户实现此对象点赞数从1到0)   同时也要setStorageSync  和  setData
            if (cookie_id.includes(item_id))   if(cookie_id[j]==item_id)   cookie_id.splice(j,1)            that.setData({                                                            wx.setStorageSync('函数名', cookie_id);
       									       [`list[${i}].likeNum`]:num,  
        									        num:num,       //es6模板语法，常规写法报错
         								                       [`list[${i}.].state`]: 'false',
        								                        state:false,    //我的数据中state为'false'是未点赞
      								                      })
         s5:若判断此对象未点过赞    则新增此次点赞的id(即用户实现此对象点赞数从0到1)      同时也要setStorageSync  和  setData  
                            else                                  cookie_id.unshift(item_id)                                    s4同理

    ②还要与数据库交互告诉后台list中此id已被点赞  并改变其state和likeNum
        treeHoleContent.doc(item_id).update({//向数据库传递数据
        data:{ 
          likeNum:this.data.num,
          state:this.data.state}
      }).then(res1=>{  
        //console.log(res1)
          wx.showToast({
            title:"操作成功",
            icon:"success",}）

---进行评论操作可进行评论功能
    ①onLoad中已获得userName并赋给了talkUser

    ②使用getInputValue函数获取评论框中的内容  并赋给talkContent
        var talkContent = e.detail.value;
        this.data.talkContent = talkContent;（不直接给data赋值时避免输入一个字保存一个字）

    ③在发表的按钮上bindtab  sendTalk函数  触发时先获取此block(list中对应的这条 用户进行评论的记录)的id赋值给item_id  为了把每个block对应的评论筛选(相当于sql操作的外键)  
       
    ④然后在数据库的treeHoleTalk集合中添加记录(此纪录有talkUser--评论的用户名  talkContent--评论框中的内容  item_id--此block的id)


######发表信息界面(commit页面)

---页面会用onLoad函数获取到云数据库(集合treeHoleUserInfo)中储存的数据 即已经授权并正在使用的用户的 userName 和 userIcon   
    ①从集合treeHoleUserInfo获取到的userName 和 userIcon赋值给data中自定义的 userName和userIcon


---可选择上传的照片(默认是3张 这个可以调整)  选择好照片后可以点击照片右上叉号删除不想发布的照片后再重新选择(注意不可不删除就重选)
    ①点击选择图片按钮触发selectImage函数   其中调用chooseImage这个API  并在其中设置最多3张图片和可用相册和相机

    ②调用 wx.cloud.uploadFile 向云存储上传所选择照片  上传照片的路径对应到fileIds-先保存到data中之后向数据库传值时赋值给image(可累加-concat  即利用for循环来实现上传多张图片)

    ③点击预选的图片右上角的叉号  调用delImage函数可以删除所点击叉号的照片(不涉及数据库操作 数据增删在js中进行)


---点击发布按钮 部分信息将上传到云数据库中treeHoleContent(image, contentMain, nowDate, ...)
     ①首先先调用getData函数获取当前时间(此处精确到秒)  然后把返回值

     ②然后把获取到的                 各值                            传递到数据库treeHoleContent集合中                                  
                                contentMain//发布的主要内容
         		image//选择的图片
        		sendTime//发送的时间 
         		likeNum点赞数量默认为0
          		state点赞状态默认为false，
        	                userName//用户的昵称
          		userIcon//用户的头像


######个人中心界面(userInfo页面)

---页面用onLoad函数从数据库的treeHoleUserInfo集合中获取到此时已授权并正使用的用户的userName 和 userIcon
     ①赋值给data中自定义的 userName和userIcon

     ②调用getData函数获取数据库 treeHoleContent集合并赋值给contentList treeHoleTalk集合并赋值给talkMain
 

---页面 之后会先从treeholeContent数据库中获取所有记录  经过  userName的比对之后 将相同userName 的数据加载出来(即实现页面展示是同一个用户发的  talkMain同理)



---每个信息框有对应的删除功能  点击删除按钮 会触发数据库相关函数将此条记录从数据库中删除(通过Id值)




特色功能( 点赞 + 评论 + 预览多张图片 )技术点
-------------点赞功能：





“树洞功能”部分：
       “树洞功能”用于查看使用此小程序的用户所发布的帖子内容并且可对帖子进行点赞和评论，同时用户也能进行发帖，
   并且用户也可查看自己的历史帖子以及此帖子对应的点赞数和评论。
   1.点击广场，查看所有用户发布的所有的帖子，包括用户对此帖子的点赞和评论。
   2.点击"+"，用于发布帖子，所发布的帖子包括文字内容和图片(图片数量有限制)。
   3.点击我的，查看用户个人历史所发布过的帖子，包括此帖子的点赞数和相关评论。同时用户也可点击删除按钮将此帖子删除。


  

 //处理移除图片的操作 
        handleRemove(file){
            // 1、获取想要删除图片的临时路径
            const filePath = file.response.data.tmp_path
            // 2、从pics数组中，找到这个图片对应的索引值
            const idx = this.addForm.pics.findIndex(x => x.pic == filePath)
            // 3、调用数组的splice方法，把图片信息对象，从pic数组中删除
            this.addForm.pics.splice(idx,1)
            console.log(this.addForm)
        },



遇到的问题
①数据库内容展示不全，即不同用户使用只展示对应用户的信息    是因为云数据库权限设置的问题   修改云数据库权限即可
②wx.navigatorTo和wx.redirectTo区别，前者跳转后有返回键  后者无返回键
③如果加载的图片使用云数据库中存储的图片  那么wxml的image标签的src应为云存储中对应照片的id值