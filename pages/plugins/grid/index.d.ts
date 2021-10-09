import { ViewPortEventParam } from '@antv/g6/lib/types';
import Base from '@antv/g6/lib/plugins/base';
interface GridConfig {
    img?: string;
}
export default class Grid extends Base {
    getDefaultCfgs(): GridConfig;
    init(): void;
    getEvents(): {
        viewportchange: string;
    };
    /**
     * viewport change 事件的响应函数
     * @param param
     */
    protected updateGrid(param: ViewPortEventParam): void;
    getContainer(): HTMLDivElement;
    destroy(): void;
}
export {};
