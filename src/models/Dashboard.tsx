import { observable, action } from "mobx";
import { TItem, Visualization } from "./Visualization";

export class Dashboard {
  @observable visualizations: TItem[] = [];
  @observable d2: any;

  @action setD2 = (d2: any) => (this.d2 = d2);

  @action addAnalyticsItem = (
    x: number,
    y: number,
    w: number,
    h: number,
    dx: string[],
    periods: string[],
    type: string,
    title: string,
    subtitle: string,
    xAxis: string = "",
    chartType: string = "column",
    filterByOu: boolean = true,
    filterByPeriods: boolean = true
  ) => {
    const item = new Visualization();
    item.setCoordinates(x, y, w, h);
    item.setDx(dx);
    item.setPeriods(periods);
    item.setFilterByOus(filterByOu);
    item.setFilterByPeriods(filterByPeriods);
    item.setType(type);
    item.setChartType(chartType);
    item.setXAxis(xAxis);
    item.setTitle(title);
    item.setSubtitle(subtitle);
    this.visualizations = [...this.visualizations, item];
  };

  @action addTextItem = (
    x: number,
    y: number,
    w: number,
    h: number,
    data: any
  ) => {
    const item = new Visualization();
    item.setType("plainText");
    item.setData(data);
    item.setCoordinates(x, y, w, h);
    item.setCssClass("");
    this.visualizations = [...this.visualizations, item];
  };

  @action addItem = (x: number, y: number, w: number, h: number) => {
    const item = new Visualization();
    item.setCoordinates(x, y, w, h);
    this.visualizations = [...this.visualizations, item];
  };
}

export const dashboard = new Dashboard();
export type TDashboard = typeof dashboard;
