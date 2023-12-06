import { Vec2, v2 } from "cc";

export class GridNode {
    /** 网格位置 */
    public position:Vec2 = null;
    /** 网格是否可行走 */
    public walkable:boolean = true;
    /** 从起始网格到当前网格的实际代价 */
    g: number = 0;
    /** 从当前网格到目标网格的预估代价 */
    h: number = 0;
    /** f = g + h 代表网格的总代价 */
    f: number = 0;
    /** 该网格的父网格, 用于构建路径 */
    parent: GridNode | null = null;
    /**
     * 
     * @param position 网格坐标
     * @param walkable 是否可行走
     */
    constructor(position:Vec2, walkable:boolean = true) {
        this.position = position;
    }

    /**
     * 判断给定的参数节点是否与自身相等
     * @param gridNode 用来比较的节点
     */
    equals(gridNode:GridNode):boolean {
        return this.position.equals(gridNode.position);
    }
}

export class Astar {
    private _map:GridNode[][] = [];
    constructor(map:GridNode[][]) {
        this._map = map;
    }

    /**
     * 查找路径
     * @param startGridNode 开始节点
     * @param endGridNode 结束节点
     * @returns 成功返回路径, 失败返回null
     */
    public findPath(startGridNode:GridNode, endGridNode:GridNode):Vec2[]|null {
        /** 待搜索节点 */
        const openList:GridNode[] = [];
        /** 已搜索节点 */
        const closedList:GridNode[] = [];

        openList.push(startGridNode);

        while(openList.length > 0) {
            /** 在待搜索节点中代价最低的节点 */
            const currentGridNode:GridNode = this.findNodeWithLowestCost(openList);
            // 将这个节点在待选节点中删除, 并在已搜索节点中添加该节点
            openList.splice(openList.indexOf(currentGridNode), 1);
            closedList.push(currentGridNode);

            // 如果当前元素等于节点元素, 那么就构建路径
            if(currentGridNode.equals(endGridNode)) {
                console.log('路径获取完成');
                // TODO: 路径返回方法
                return this.constructPath(startGridNode, endGridNode);
            }
            /**
             * 临近节点数组
             */
            const neighbors:GridNode[] = this.getWalkableNeighbors(currentGridNode);
            for(const neighbor of neighbors) {
                // neighbor是否存在与已搜索的节点中
                if(closedList.some(p => p.position.equals(neighbor.position))) {
                    continue;
                }
                /** neighbor的实际代价 */
                const gScore = currentGridNode.g +this.calculateGScore(currentGridNode);
                /** neighbor的估算代价*/
                const hScore = this.calculateHScore(neighbor, endGridNode);
                /** neighbor 的总代价 */
                const fScore = gScore + hScore;

                // 待搜索列表中不存在该元素
                if(!openList.some(p=>p.position.equals(neighbor.position))) {
                    // 就添加到待搜索列表中
                    neighbor.g = gScore;
                    neighbor.h = hScore;
                    neighbor.f = fScore;
                    neighbor.parent = currentGridNode;
                    openList.push(neighbor);
                } else {
                    // 替换实际代价最低的元素
                    if(gScore < neighbor.g) {
                        neighbor.g = gScore;
                        neighbor.h = hScore;
                        neighbor.f = fScore;
                        neighbor.parent = currentGridNode;
                    }
                }
                
            }
        }

        return null;
    }

    /** 
    * 计算从当前节点到邻居节点的实际代价
    * 
    */
    private calculateGScore(currentNode: GridNode): number {
        // 假设每一步的实际代价都是1
        return currentNode.g + 1;
    }

    /**  
    * 计算启发式（H 分数），使用曼哈顿距离
    * 
    */
    private calculateHScore(neighbor: GridNode, endNode: GridNode): number {
        return Math.abs(neighbor.position.x - endNode.position.x) + Math.abs(neighbor.position.y - endNode.position.y);
    }

    /**
     * 获取临近的四个方向的节点
     * @param gridnode 中心节点
     * @returns 返回临近的四个方向的节点
     */
    private getWalkableNeighbors(gridnode:GridNode) : GridNode[] {
        // const tmpPos:Vec2 = new GridNode(gridnode.position).position;
        const neighbors:GridNode[] = [];
        const directions:Vec2[] = [
            v2(0,1),
            v2(0,-1),
            v2(1,0),
            v2(-1,0)
        ];

        for(const dir of directions) {
            const tmpPos = v2(gridnode.position.x, gridnode.position.y);
            tmpPos.add(dir);
            //console.log(`tmppos:${tmpPos} , 增量是: ${dir}`);
            
            // 判断是否超出边界并且是可行走的
            const node = this.getGridNode(tmpPos);
            // 这个元素存在就证明不会超过边界
            if(node!= null && node.walkable) {
                neighbors.push(node);
            }
        }
        //console.log('===============================')
        return neighbors;
    }

    /**
     * 通过位置获取网格
     * @param pos 网格的位置
     */
    getGridNode(pos:Vec2):GridNode | null {
        if(this.isValidPosition(pos)) {
            return this._map[pos.x][pos.y];
        }
        return null;
    }

    /**
     * 检查位置是否在有效范围内
     */
    private isValidPosition(pos: Vec2): boolean {
        return pos.x >= 0 &&
               pos.y >= 0 &&
               pos.x < this._map.length &&
               pos.y < this._map[0].length;
    }
    /**
     * 从终点回溯到起点
     * @param startGridNode 起点
     * @param endGridNode 终点
     * @returns 返回构建的路径
     */
    private constructPath(startGridNode:GridNode, endGridNode:GridNode, ): Vec2[] | null {
        const path:Vec2[] = [];
        // 通过倒序进行排列
        let currentGridNode:GridNode = endGridNode;
        while(currentGridNode.parent !== null || currentGridNode.equals(startGridNode)) {
            // 将元素添加到数组的开头
            path.unshift(currentGridNode.position);
            if(currentGridNode.equals(startGridNode)) break;
            currentGridNode = currentGridNode.parent;
        }
        return path.length > 0 ? path : null;
    }

    /**
     * 从待选列表中寻找总代价最低的节点返回
     * @param list 待选列表
     * @returns 最低的节点, 否则返回null
     */
    private findNodeWithLowestCost(list:GridNode[]): GridNode|null {
        if(list.length < 0) return null;
        let lowestGridNode: GridNode = list[0];
        for(const gridNode of list) {
            if(lowestGridNode.f > gridNode.f) lowestGridNode = gridNode;
        }
        return lowestGridNode;
    }
 }