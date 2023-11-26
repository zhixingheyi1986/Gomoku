import { _decorator, Component, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 棋盘的格子类
 */
@ccclass('Cell')
export class Cell extends Component {
    private _piece: Node = null;
    /**
     * 设置当前格子上的棋子
     * 在设置的同时会将棋子节点添加为格子节点的子节点
     */
    public set piece(value: Node) {
        // 如果有就删除以前的
        if (this._piece) {
            this.node.removeChild(this._piece);
        }

        if (value) {
            this._piece = value;
            this.node.addChild(value);
        }
    }
    /**
     * 获取当期格子上的棋子
     */
    public get piece(): Node {
        return this._piece;
    }
    /** 这个格子在棋盘中的位置 */
    public coordinate: Vec2 = null;
}


