import { _decorator, Component, EventTarget, EventTouch, Input, input, Node, Vec2 } from 'cc';
import { Piece } from './Piece';
const { ccclass, property } = _decorator;
/**
 * 棋盘的格子类
 */
@ccclass('Cell')
export class Cell extends Component {
    private _piece: Piece = null;
    /**
     * 设置当前格子上的棋子
     * 在设置的同时会将棋子节点添加为格子节点的子节点
     */
    public set piece(value: Piece) {
        // 如果有就删除以前的
        if (this._piece) {
            this.node.removeChild(this._piece.node);
        }

        if (value) {
            this._piece = value;
            this.node.addChild(value.node);
        }
    }
    /**
     * 获取当期格子上的棋子
     */
    public get piece(): Piece {
        return this._piece;
    }
    /** 这个格子在棋盘中的位置 */
    public coordinate: Vec2 = null;

    protected start(): void {
        this.node.on(Input.EventType.TOUCH_END, this._on_touch_end, this);
        
    }
    protected onDestroy(): void {
        this.node.off(Input.EventType.TOUCH_END, this._on_touch_end, this);
    }

    /**
     * 当手指或鼠标在该位置松开的时候调用这个方法
     * @param event 
     */
    _on_touch_end(event:EventTouch) {
        console.log(`手指松开 在棋盘中的位置:-> ${this.coordinate}`);
        this.node.emit('ON_PRESSEN', this)
    }
}


