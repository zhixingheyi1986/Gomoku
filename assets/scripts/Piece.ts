import { _decorator, Component, Node, Sprite, SpriteFrame, tween, Tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Piece')
export class Piece extends Component {
    /**
     * 保存精灵图集中的所有内容
     */
    private _animals: Array<SpriteFrame> = null;
    /**
     * 精灵组件
     */
    private _sprite: Sprite = null;
    private _tween:Tween<Node> = null;
    private _piece_type: number = 0;
    /**
     * 设置精灵组件的类型, 这个类型就是在图集中的下标
     */
    public set piece_type(index: number) {
        if (index > this._animals.length) return;
        this._sprite.spriteFrame = this._animals[index];
        this._piece_type = index;
    }
    /**
     * 获取精灵组件的类型, 这个类型是在图集中的下标
     */
    public get piece_type(): number {
        return this._piece_type;
    }

    protected onLoad(): void {
        this._animals = this.node.getComponent(Sprite).spriteAtlas.getSpriteFrames();
        this._sprite = this.node.getComponent(Sprite);
    }

    start() {
        //console.log(`Piece.ts -> 图集的长度: ${this._animals.length}`)
        //this._sprite.spriteFrame = this._animals[4];
    }
    /**
     * 棋子被取消选中
     */
    unselected() {
        this._tween?.stop();
        tween(this.node).to(0.1, {scale: new Vec3(1, 1)}).start();
    }
    /**
     * 棋子被选中
     */
    selected() {
        this._tween = tween(this.node)
        .to(0.2, {scale: new Vec3(0.5, 0.5)})
        .to(0.2, {scale: new Vec3(1, 1)})
        .union()
        .repeatForever()
        .start();
    }
}


