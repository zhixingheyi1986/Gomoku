import { _decorator, CCClass, CCInteger, Component, instantiate, Label, log, Node, Prefab, randomRangeInt, v2, Vec2 } from 'cc';
const { ccclass, property } = _decorator;
import { Cell } from './Cell';
import { Piece } from './Piece';
import { Astar, GridNode } from './utils/Utils';

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


    private _GridNode:GridNode[][] = [];
    private _astar:Astar = null;
    /** 格子的大小, 这里写死了 */
    private _cell_size: Vec2 = v2(100, 100)
    private _select_cell:Cell|null = null;
    /**
     * 设置选中的棋子
     */
    public set select_cell(cell: Cell|null) {
        if(this._select_cell != null) // 已经有选中的了, 就停止播放它的动画
            this._select_cell.piece.unselected();
        this._select_cell = cell;
        if(cell != null)
            this._select_cell.piece.selected();
        
    }
    /**
     * 获取选中的棋子
     */
    public get select_cell():Cell|null {
        return this._select_cell;
    }

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
        for (let i = 0; i < this.row; i++) {
            this._GridNode.push(new Array(this.column));
            for (let j = 0; j < this.column; j++) {
                let temp_cell: Node = instantiate(this.cell_prefab);
                this.node.addChild(temp_cell);
                x = (i + 1) * this._cell_size.x;
                y = (j + 1) * this._cell_size.y; // + this.cell_spacing)
                temp_cell.setPosition(x, y);
                const pos = v2(i, j);
                temp_cell.getComponent(Cell).coordinate = pos;
                temp_cell.on('ON_PRESSEN', this._on_cell_pressed.bind(this));
                temp_cell.getComponent(Cell).lbstr = `${i}x${j}`;
                this._GridNode[i][j] = new GridNode(pos);
            }
        }
        this._astar = new Astar(this._GridNode);
        this.spawRandomPiece()
    }

    /**
     * 格子点击事件的回调方法
     * @param cell 是点击的那个格子
     */
    _on_cell_pressed(cell: Cell) {
        // console.log(`_on_cell_pressed -> 当前点击的格子: ${cell.coordinate}`);
        if(cell.piece != null) {
            this.select_cell = cell;
        } else if(this.select_cell != null) {
            // TODO: 点击的是空白格子,就进行寻路并移动
            //let paths = this._a_star.findPath(this.grid[cell.coordinate.x][cell.coordinate.y], this.grid[this.select_cell.coordinate.x][this.select_cell.coordinate.y])
            const startNode:GridNode = this._GridNode[this.select_cell.coordinate.x][this.select_cell.coordinate.y];
            const endNode:GridNode = this._GridNode[cell.coordinate.x][cell.coordinate.y];
            const paths = this._astar.findPath(startNode, endNode);
            if(paths != null) {
                console.log(`路径: ${paths}`)
                //const temp_cell = this.getCell(v2(1, 4));
                //temp_cell.background = true;
                //const temp_cell2 = this.getCell(v2(4, 1));
                //temp_cell2.background = true;
                 for(const pos of paths) {
                     const temp_cell = this.getCell(pos);
                     temp_cell.background = true;
                 }
            } else {
                console.log(`没有找到路径`);
            }
        }
    }
    /** 
     * 在随机位置生成3个棋子
     */
    spawRandomPiece() {
        for (let i = 0; i < 3; i++) {
            this.spawOnePiece();
        }
    }

    /**
     * # 随机生成一个棋子
     * @param pieceType 棋子的种类数量
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
        const piece = instantiate(this.piece_prefab).getComponent(Piece);
        cell.piece = piece;
        piece.piece_type = randomRangeInt(0, pieceType);
        console.log(`随机生成棋子的位置: ${coordinate}, 显示位置: ${cell.coordinate}`);
        this._GridNode[cell.coordinate.x][cell.coordinate.y].walkable = false;
    }

    /**
     * # 这个棋子指定的棋盘格子中存在吗
     * @param coordinate 棋子在整个棋盘中的位置
     * @returns 存在返回真, 不存在返回假
     */
    hasPiece(coordinate: Vec2): boolean {
        const cell = this.getCell(coordinate);
        return cell.piece != null;
    }

    /**
     * # 通过棋子在棋盘中的位置获取节点
     * @param coordinate 
     * @returns 
     */
    getCell(coordinate: Vec2): Cell {
        const index = coordinate.x * this.column + coordinate.y;
        return this.node.children[index].getComponent(Cell);
    }
}


