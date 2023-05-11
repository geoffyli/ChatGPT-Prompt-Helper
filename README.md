# ChatGPT-Prompt-Helper

一个能帮助用户创建和使用预制prompt模板的油猴插件

## 下载与安装

1. 下载zip文件
    
    ![Untitled](ChatGPT-Prompt-Helper%20f54c11cd82044be88f89a58d27bc3c01/Untitled.png)
    
2. 打开油猴管理面板，选择“设置”。”Config mode”设置为高级
    
    ![Untitled](ChatGPT-Prompt-Helper%20f54c11cd82044be88f89a58d27bc3c01/Untitled%201.png)
    
3. 选择油猴“实用工具”，勾选”包含脚本存储”, 点击”选择文件”
    
    ![Untitled](ChatGPT-Prompt-Helper%20f54c11cd82044be88f89a58d27bc3c01/Untitled%202.png)
    
4. 找到下载的zip文件，点击”打开“
5. 勾选”存储”、”外部“，随后点击导入
    
    ![Untitled](ChatGPT-Prompt-Helper%20f54c11cd82044be88f89a58d27bc3c01/Untitled%203.png)
    
6. 选择油猴”已安装的脚本“，开启Prompt Helper
    
    ![Untitled](ChatGPT-Prompt-Helper%20f54c11cd82044be88f89a58d27bc3c01/Untitled%204.png)
    

## 使用说明

### 创建预制模板

1. 打开Prompt Helper编辑页面，选择存储
    
    ![Untitled](ChatGPT-Prompt-Helper%20f54c11cd82044be88f89a58d27bc3c01/Untitled%205.png)
    
2. 编辑存储内容
    - 格式
        
        ```json
        {
            "组名01": [
                {
                    "name": "模板名",
                    "text": "模板",
                    "placeholders": [
                        "占位符1", "占位符2", ...
                    ]
                },
                ...
            ],
            ...
        ```
        
    - 注意
        - 组名、模板名不可重复
        - `text`中以`$`为占位符，`placeholders`中元素数量应等于`text`中`$`的数量
        - text中的`"`应用`\"`代替
3. 使用预制模板
    1. 选择模板
        
        ![Untitled](ChatGPT-Prompt-Helper%20f54c11cd82044be88f89a58d27bc3c01/Untitled%206.png)
        
    2. 输入参数
        
        ![Untitled](ChatGPT-Prompt-Helper%20f54c11cd82044be88f89a58d27bc3c01/Untitled%207.png)
        
        - 如果有多个参数，不同参数间用`|`隔开
        - 完成占位符替换的prompt会展示在下方
    3. 发送prompt
