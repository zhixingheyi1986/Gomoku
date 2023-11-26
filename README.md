# Gomoku

> 使用Cocos Creator 创建一个五子连珠的2D游戏
>
>> 版本为: 3.8
>>

## 创建棋盘

  通过循环来构建一个6*9的棋盘, 具体实现参看 Board.ts中的 initBoard方法

  [Board.ts](/assets/scripts/Board.ts "initBoad方法")

## 生成棋子
    1. piece.ts 
        - 在棋子的脚本文件中添加 `piece_type` 
            - set : 设置精灵组件的图片
            - get : 获取精灵组件图片的下标, 来为后面消除做类型判断
        
    2. cell.ts
        - 在棋盘格子的脚本文件中添加 `piece`
            - set : 这个格子中存在棋子就删除, 随后添加这个新的棋子
            - get : 获取这个格子上的棋子, 没有返回 null

