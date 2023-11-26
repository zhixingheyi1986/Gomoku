import { _decorator, CCInteger, Component, instantiate, Node, Prefab, v2, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Cells')
export class Cells extends Component {
    @property({ type: Prefab, displayName: '棋盘格子预制体' })
    cell_prefab: Prefab = null;
    @property({ type: CCInteger, displayName: '格子间距' })
    cell_spacing: number = 1;

    private _cell_size: Vec2 = v2(64, 64)


    start() {
        this.initCells();
    }
    /**
     * 初始化棋盘
     */
    initCells() {
        if (this.cell_prefab == null) return;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 15; j++) {
                let temp_cell = instantiate(this.cell_prefab);
                this.node.addChild(temp_cell);
                temp_cell.setPosition(
                    (i+1) * (this._cell_size.x + this.cell_spacing),
                    (j+1) * (this._cell_size.y + this.cell_spacing)
                );
                console.log(`坐标: X->${(i+1) * (this._cell_size.x + this.cell_spacing)} Y-> ${(j+1) * (this._cell_size.y + this.cell_spacing)}`)
            }
        }
    }

    update(deltaTime: number) {

    }
}


