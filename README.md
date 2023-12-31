# Gomoku

> 使用Cocos Creator 创建一个五子连珠的2D游戏
>
>> 版本为: 3.8
>>

## 整体游戏的流程

![1700980517816](image/README/1700980517816.png)

## 创建棋盘

  通过循环来构建一个6*9的棋盘, 具体实现参看 Board.ts中的 initBoard方法

  [Board.ts](/assets/scripts/Board.ts "initBoad方法")

## 生成棋子

1. piece.ts

   * 在棋子的脚本文件中添加 `piece_type`
     * set : 设置精灵组件的图片
     * get : 获取精灵组件图片的下标, 来为后面消除做类型判断
2. cell.ts

   * 在棋盘格子的脚本文件中添加 `piece`
     * set : 这个格子中存在棋子就删除, 随后添加这个新的棋子
     * get : 获取这个格子上的棋子, 没有返回 null

## 棋盘格子响应点击事件

1. 响应点击事件
   * 在cell.ts文件添加点击响应事件
   * 将这个响应发送到棋盘中
   * 棋盘监听此事件
     ```TypeScript
     if(这个格子中有没有棋子) {
         将已选中棋子,更改为这个
     } else if(是否有选中的棋子) {
         执行移动操作
     }
     没有就啥也不干
     ```
2. 设置棋子的缩放动画
   * 选中状态播放缩放动画
   * 取消选中, 还原默认缩放
3. 寻路操作
   使用的是A*算法实现的寻路操作, 修改了一些BUG
   寻路算法在 [Utils.ts](/assets/scripts/utils/Utils.ts "A*算法实现")
