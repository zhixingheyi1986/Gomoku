import { _decorator, CCClass, CCInteger, Component, instantiate, Node, Prefab, randomRangeInt, v2, Vec2 } from 'cc';
const { ccclass, property } = _decorator;
import { Cell } from './Cell';
import { Piece } from './Piece';

@ccclass('Board')
export class Board extends Component {
    @property({ type: Prefab, displayName: '棋盘格子预制体' })
    cell_prefab: Prefab = null;
    @property({ type: Prefab, displayName: '棋子预制体' })
    piece_prefab: Prefab = null;
    @property({ type: CCInteger, displayName: '格子间距' })
    cell_spacing: number = 1;
    @property({ type: CCInteger, displayName: '棋盘列数' })
    column: number = 6;
    @property({ type: CCInteger, displayName: '棋盘行数' })
    row: number = 9;

    /** 格子的大小, 这里写死了 */
    private _cell_size: Vec2 = v2(100, 100)


    start() {
        this.initBoard();
    }
    /**
     * # 初始化棋盘  
     * - 通过循环来生成一个6*9的棋盘
     */
    initBoard() {
        let x: number = 0, y: number = 0;

        if (this.cell_prefab == null) return;
        for (let i = 0; i < this.column; i++) {
            for (let j = 0; j < this.row; j++) {
                let temp_cell: Node = instantiate(this.cell_prefab);
                this.node.addChild(temp_cell);
                x = (i + 1) * (this._cell_size.x + this.cell_spacing);
                y = (j + 1) * (this._cell_size.y + this.cell_spacing)
                temp_cell.setPosition(x, y);
                temp_cell.getComponent(Cell).coordinate = v2(i, j);
            }
        }
        this.spawRandomPiece()
    }

    /** 
     * # 在随机位置生成3个棋子
     */
    spawRandomPiece() {
        for (let i = 0; i < 3; i++) {
            this.spawOnePiece();
        }
    }

    /**
     * # 随机生成一个棋子
     */
    spawOnePiece(pieceType: number = 5) {
        // - 随机出一个坐标
        const coordinate = v2(
            randomRangeInt(0, this.column),
            randomRangeInt(0, this.row)
        )
        // - 这里使用的是递归调用
        if (this.hasPiece(coordinate)) return this.spawOnePiece();
        // - 判断这个坐标上有没有棋子
        const cell = this.getCell(coordinate);
        const piece = instantiate(this.piece_prefab);
        cell.getComponent(Cell).piece = piece;
        piece.getComponent(Piece).piece_type = randomRangeInt(0, pieceType);
    }

    /**
     * # 这个棋子指定的棋盘格子中存在吗
     * @param coordinate 棋子在整个棋盘中的位置
     * @returns 存在返回真, 不存在返回假
     */
    hasPiece(coordinate: Vec2): boolean {
        const cell = this.getCell(coordinate);
        return cell.getComponent(Cell).piece != null;
    }

    /**
     * # 通过棋子在棋盘中的位置获取节点
     * @param coordinate 
     * @returns 
     */
    getCell(coordinate: Vec2): Node {
        const index = coordinate.x * this.row + coordinate.y;
        return this.node.children[index];
    }
}


